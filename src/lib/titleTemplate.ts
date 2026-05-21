// Strips leading articles so "The Old Tree Puzzle Maker" becomes
// "Emma's Old Tree Puzzle Maker" — not "Emma's The Old Tree Puzzle Maker"
function stripLeadingArticle(name: string): string {
  return name.replace(/^(The|A|An)\s+/i, '').trim()
}

export function makeGameTitle(
  childName: string,
  themeName: string,
  templateName: string,
): string {
  const themeLabel = stripLeadingArticle(themeName)
  const name = childName.trim()
  if (name) return `${name}'s ${themeLabel} ${templateName}`
  return `${themeLabel} ${templateName}`
}
