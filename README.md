# Nicolas Klein Photography

Professional photography portfolio built with Next.js and Strapi CMS.

## Stack

-   Next.js 15
-   TypeScript
-   Tailwind CSS
-   Strapi CMS
-   Vercel deployment

## Setup

1. **Clone and install**

```bash
git clone <repo-url>
cd photography-portfolio
pnpm install
```

2. **Environment**

```bash
cp example.env .env.local
# Edit .env.local with your Strapi URL and API token
```

3. **Strapi Setup**
   Deploy Strapi using [Strapi Cloud](https://cloud.strapi.io) (recommended) or self-host.

    Create these content types in Strapi admin:

-   **Gallery Items**: `title`, `image` (media), `tag`
-   **Portfolio Items**: `title`, `image` (media), `description`
-   **Bio**: `title`, `description`, `tags` (array), `profileImage` (media)

4. **Development**

```bash
pnpm dev
```

## Roadmap

-   Improve sizes of the images hosted on Strapi
-   Add proper analytics
-   Setup Google Search Console

## License

[MIT License](http://zenorocha.mit-license.org/) © Nicolas Klein
