package net.minecraft.client.render;

import com.mojang.blaze3d.systems.RenderSystem;
import java.util.Objects;
import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.gl.ShaderProgram;
import net.minecraft.client.gl.ShaderProgramKeys;
import net.minecraft.client.gl.SimpleFramebuffer;
import net.minecraft.client.render.BufferBuilder;
import net.minecraft.client.render.BufferRenderer;
import net.minecraft.client.render.GameRenderer;
import net.minecraft.client.render.VertexFormat;
import net.minecraft.client.render.VertexFormats;
import net.minecraft.client.world.ClientWorld;
import net.minecraft.entity.LivingEntity;
import net.minecraft.entity.effect.StatusEffectInstance;
import net.minecraft.entity.effect.StatusEffects;
import net.minecraft.util.math.MathHelper;
import net.minecraft.util.profiler.Profiler;
import net.minecraft.util.profiler.Profilers;
import net.minecraft.world.dimension.DimensionType;
import org.joml.Vector3f;
import org.joml.Vector3fc;

@Environment(value=EnvType.CLIENT)
public class LightmapTextureManager
implements AutoCloseable {
    public static final int MAX_LIGHT_COORDINATE = 0xF000F0;
    public static final int MAX_SKY_LIGHT_COORDINATE = 0xF00000;
    public static final int MAX_BLOCK_LIGHT_COORDINATE = 240;
    private static final int field_53098 = 16;
    private final SimpleFramebuffer lightmapFramebuffer;
    private boolean dirty;
    private float flickerIntensity;
    private final GameRenderer renderer;
    private final MinecraftClient client;

    public LightmapTextureManager(GameRenderer renderer, MinecraftClient client) {
        this.renderer = renderer;
        this.client = client;
        this.lightmapFramebuffer = new SimpleFramebuffer(16, 16, false);
        this.lightmapFramebuffer.setTexFilter(9729);
        this.lightmapFramebuffer.setClearColor(1.0f, 1.0f, 1.0f, 1.0f);
        this.lightmapFramebuffer.clear();
    }

    @Override
    public void close() {
        this.lightmapFramebuffer.delete();
    }

    public void tick() {
        this.flickerIntensity += (float)((Math.random() - Math.random()) * Math.random() * Math.random() * 0.1);
        this.flickerIntensity *= 0.9f;
        this.dirty = true;
    }

    public void disable() {
        RenderSystem.setShaderTexture(2, 0);
    }

    public void enable() {
        RenderSystem.setShaderTexture(2, this.lightmapFramebuffer.getColorAttachment());
    }

    private float getDarknessFactor(float delta) {
        StatusEffectInstance statusEffectInstance = this.client.player.getStatusEffect(StatusEffects.DARKNESS);
        if (statusEffectInstance != null) {
            return statusEffectInstance.getFadeFactor(this.client.player, delta);
        }
        return 0.0f;
    }

    private float getDarkness(LivingEntity entity, float factor, float delta) {
        float f = 0.45f * factor;
        return Math.max(0.0f, MathHelper.cos(((float)entity.age - delta) * (float)Math.PI * 0.025f) * f);
    }

    public void update(float delta) {
        if (!this.dirty) {
            return;
        }
        this.dirty = false;
        Profiler profiler = Profilers.get();
        profiler.push("lightTex");
        ClientWorld clientWorld = this.client.world;
        if (clientWorld == null) {
            return;
        }
        float f = clientWorld.getSkyBrightness(1.0f);
        float g = clientWorld.getLightningTicksLeft() > 0 ? 1.0f : f * 0.95f + 0.05f;
        float h = this.client.options.getDarknessEffectScale().getValue().floatValue();
        float i = this.getDarknessFactor(delta) * h;
        float j = this.getDarkness(this.client.player, i, delta) * h;
        float k = this.client.player.getUnderwaterVisibility();
        float l = this.client.player.hasStatusEffect(StatusEffects.NIGHT_VISION) ? GameRenderer.getNightVisionStrength(this.client.player, delta) : (k > 0.0f && this.client.player.hasStatusEffect(StatusEffects.CONDUIT_POWER) ? k : 0.0f);
        Vector3f vector3f = new Vector3f(f, f, 1.0f).lerp((Vector3fc)new Vector3f(1.0f, 1.0f, 1.0f), 0.35f);
        float m = this.flickerIntensity + 1.5f;
        float n = clientWorld.getDimension().ambientLight();
        boolean bl = clientWorld.getDimensionEffects().shouldBrightenLighting();
        float o = this.client.options.getGamma().getValue().floatValue();
        ShaderProgram shaderProgram = Objects.requireNonNull(RenderSystem.setShader(ShaderProgramKeys.LIGHTMAP), "Lightmap shader not loaded");
        shaderProgram.getUniformOrDefault("AmbientLightFactor").set(n);
        shaderProgram.getUniformOrDefault("SkyFactor").set(g);
        shaderProgram.getUniformOrDefault("BlockFactor").set(m);
        shaderProgram.getUniformOrDefault("UseBrightLightmap").set(bl ? 1 : 0);
        shaderProgram.getUniformOrDefault("SkyLightColor").set(vector3f);
        shaderProgram.getUniformOrDefault("NightVisionFactor").set(l);
        shaderProgram.getUniformOrDefault("DarknessScale").set(j);
        shaderProgram.getUniformOrDefault("DarkenWorldFactor").set(this.renderer.getSkyDarkness(delta));
        shaderProgram.getUniformOrDefault("BrightnessFactor").set(Math.max(0.0f, o - i));
        this.lightmapFramebuffer.beginWrite(true);
        BufferBuilder bufferBuilder = RenderSystem.renderThreadTesselator().begin(VertexFormat.DrawMode.QUADS, VertexFormats.BLIT_SCREEN);
        bufferBuilder.vertex(0.0f, 0.0f, 0.0f);
        bufferBuilder.vertex(1.0f, 0.0f, 0.0f);
        bufferBuilder.vertex(1.0f, 1.0f, 0.0f);
        bufferBuilder.vertex(0.0f, 1.0f, 0.0f);
        BufferRenderer.drawWithGlobalProgram(bufferBuilder.end());
        this.lightmapFramebuffer.endWrite();
        profiler.pop();
    }

    public static float getBrightness(DimensionType type, int lightLevel) {
        return LightmapTextureManager.getBrightness(type.ambientLight(), lightLevel);
    }

    public static float getBrightness(float ambientLight, int lightLevel) {
        float f = (float)lightLevel / 15.0f;
        float g = f / (4.0f - 3.0f * f);
        return MathHelper.lerp(ambientLight, g, 1.0f);
    }

    public static int pack(int block, int sky) {
        return block << 4 | sky << 20;
    }

    public static int getBlockLightCoordinates(int light) {
        return light >>> 4 & 0xF;
    }

    public static int getSkyLightCoordinates(int light) {
        return light >>> 20 & 0xF;
    }

    public static int applyEmission(int light, int lightEmission) {
        if (lightEmission == 0) {
            return light;
        }
        int i = Math.max(LightmapTextureManager.getSkyLightCoordinates(light), lightEmission);
        int j = Math.max(LightmapTextureManager.getBlockLightCoordinates(light), lightEmission);
        return LightmapTextureManager.pack(j, i);
    }
}
