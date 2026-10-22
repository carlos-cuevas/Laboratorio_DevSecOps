import { appConfig, navCategories, navItems } from '@/common/constants';

export const dynamic = 'force-static';

export function GET() {
  const categories = Object.values(navCategories).filter(
    (category) => category.visibleOnSidebar
  );

  const sections = categories.map((category) => {
    const tools = navItems
      .filter((tool) => tool.category === category.id && tool.route)
      .map(
        (tool) =>
          `- [${tool.pageTitle}](${appConfig.url}${tool.route}): ${tool.description}`
      );
    return `## ${category.name}\n${tools.join('\n')}`;
  });

  const body = [
    `# ${appConfig.name}`,
    '',
    `> Free, open-source online developer tools. Every tool runs entirely in the browser — no signup, no limits, and no data ever leaves the device.`,
    '',
    appConfig.description,
    '',
    sections.join('\n\n'),
    '',
    '## Project',
    `- [About](${appConfig.url}/about)`,
    `- [GitHub repository](${appConfig.githubUrl}): MIT-licensed source code`,
    `- Built by [${appConfig.creator}](${appConfig.creatorUrl})`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
