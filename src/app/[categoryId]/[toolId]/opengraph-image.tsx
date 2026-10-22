import { ImageResponse } from 'next/og';
import { appConfig } from '@/common/constants/app.constant';
import { getCategoryById, getNavItemByCategoryAndTool } from '@/common/utils';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'DevEase - Free Online Developer Tools';

interface OgImageProps {
  params: Promise<{ categoryId: string; toolId: string }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const { categoryId, toolId } = await params;

  const tool = getNavItemByCategoryAndTool(categoryId, toolId);
  const category = getCategoryById(categoryId);

  const title = tool?.pageTitle ?? appConfig.name;
  const description = tool?.description ?? appConfig.description;
  const categoryName = category?.name ?? 'Developer Tools';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#0a0a0a',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.18), transparent 45%), radial-gradient(circle at 10% 90%, rgba(16, 185, 129, 0.10), transparent 40%)',
          color: '#fafafa',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', fontSize: 44, fontWeight: 700 }}>
            <span>{appConfig.firstName}</span>
            <span style={{ color: '#10b981' }}>{appConfig.lastName}</span>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              color: '#10b981',
              border: '2px solid rgba(16, 185, 129, 0.45)',
              borderRadius: 999,
              padding: '8px 28px',
            }}
          >
            {categoryName}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 28,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: '#a3a3a3',
              maxWidth: 980,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 26,
            color: '#737373',
          }}
        >
          <div style={{ display: 'flex' }}>
            Free · Open Source · Runs in your browser
          </div>
          <div style={{ display: 'flex', color: '#10b981' }}>devease.app</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
