import { katex } from '@mdit/plugin-katex'

/**
 * Install the site's math renderer. Keeping this in one module lets the build
 * and the repository-wide regression test exercise exactly the same options.
 *
 * @param {import('markdown-it')} md
 */
export function useKatex(md) {
  md.use(katex, {
    logger: () => 'ignore',
    output: 'htmlAndMathml',
    throwOnError: true,
  })
}
