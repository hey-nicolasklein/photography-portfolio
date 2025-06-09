import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Nicolas Klein Photography';
    const description = searchParams.get('description') || 'Professionelle Fotografie in Saarbrücken';
    const type = searchParams.get('type') || 'default';

    // Different layouts based on page type
    const getLayout = () => {
      switch (type) {
        case 'portfolio':
          return (
            <div
              style={{
                background: 'linear-gradient(45deg, #000000 0%, #333333 100%)',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter',
                color: 'white',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  textAlign: 'center',
                  marginBottom: 20,
                  textTransform: 'uppercase',
                  zIndex: 1,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 300,
                  color: '#cccccc',
                  textAlign: 'center',
                  maxWidth: 800,
                  lineHeight: 1.4,
                  zIndex: 1,
                }}
              >
                {description}
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 40,
                  right: 40,
                  fontSize: 18,
                  fontWeight: 300,
                  color: '#999999',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                nicolasklein.photography
              </div>
            </div>
          );
        case 'pricing':
          return (
            <div
              style={{
                background: 'white',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter',
                color: 'black',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textAlign: 'center',
                  marginBottom: 20,
                  textTransform: 'uppercase',
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 300,
                  color: '#666666',
                  textAlign: 'center',
                  maxWidth: 800,
                  lineHeight: 1.4,
                  marginBottom: 40,
                }}
              >
                {description}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 40,
                  fontSize: 20,
                  fontWeight: 500,
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 300 }}>€100</div>
                  <div style={{ color: '#666666' }}>Portrait</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 300 }}>€200</div>
                  <div style={{ color: '#666666' }}>Event</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 300 }}>€300</div>
                  <div style={{ color: '#666666' }}>Follow Around</div>
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 40,
                  right: 40,
                  fontSize: 18,
                  fontWeight: 300,
                  color: '#999999',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                nicolasklein.photography
              </div>
            </div>
          );
        default:
          return (
            <div
              style={{
                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter',
                color: 'white',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <div
                style={{
                  fontSize: 80,
                  fontWeight: 300,
                  letterSpacing: '0.2em',
                  textAlign: 'center',
                  marginBottom: 30,
                  textTransform: 'uppercase',
                  zIndex: 1,
                }}
              >
                Nicolas Klein
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 300,
                  color: '#cccccc',
                  textAlign: 'center',
                  marginBottom: 40,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  zIndex: 1,
                }}
              >
                Photography
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 300,
                  color: '#999999',
                  textAlign: 'center',
                  maxWidth: 700,
                  lineHeight: 1.4,
                  zIndex: 1,
                }}
              >
                {description}
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 40,
                  left: 40,
                  right: 40,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 300,
                    color: '#666666',
                    letterSpacing: '0.1em',
                  }}
                >
                  Porträts • Events • Follow Around
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 300,
                    color: '#999999',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  nicolasklein.photography
                </div>
              </div>
            </div>
          );
      }
    };

    return new ImageResponse(getLayout(), {
      width: 1200,
      height: 630,
    });
  } catch (e: any) {
    console.log(`Failed to generate dynamic OG image: ${e.message}`);
    // Redirect to static fallback image
    return Response.redirect('/og-default.svg', 302);
  }
} 