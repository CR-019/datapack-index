-- 投稿来源留痕（§9.4 ①：原始 zip 存 inbox，内容寻址）
-- 有了这两列，"这条修订是从哪个原始包来的"永远可查，
-- 也让审核争议有据可依（作者当时提交的就是这个包）。

ALTER TABLE revisions ADD COLUMN source_path TEXT;
ALTER TABLE revisions ADD COLUMN source_sha256 TEXT;
