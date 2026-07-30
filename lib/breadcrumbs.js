// Builds a schema.org BreadcrumbList from the same { name, url } crumbs
// passed to views/partials/breadcrumbs.ejs, prepending Home automatically.
function breadcrumbList(siteOrigin, crumbs) {
  const items = [{ name: 'Home', url: '/' }, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteOrigin}${item.url}`,
    })),
  };
}

module.exports = { breadcrumbList };
