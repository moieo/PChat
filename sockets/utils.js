function checkHtml(html) {
  const reg_script = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<script>/gi;
  const reg_style = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>|<style>/gi;
  return html.match(reg_script) || html.match(reg_style);
}

module.exports = {
  checkHtml
}
