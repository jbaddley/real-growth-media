import { Fetcher } from "../../../../lib/fetcher";
import { ArticleContentExpanded } from "../../../../lib/types/ArticleContentExpanded";
import { env } from "process";
import dayjs from "dayjs";

const renderPost = (html: string) => <div dangerouslySetInnerHTML={{ __html: html }} />;

export default async function Article({ params }) {
  const { data: article } = await Fetcher.get<ArticleContentExpanded>(
    `${env.NEXTAUTH_URL}/api/category/${params.categorySlug}/article/${params.articleSlug}/article-content/${params.contentId}`,
    { next: { revalidate: 1 } }
  );

  return (
    <div className='m-5 mx-auto max-w-4xl rounded border bg-white p-7 shadow-md'>
      <div className='mb-5 flex flex-wrap space-y-4 md:flex-nowrap md:space-x-4 md:space-y-0'>
        <a target='_blank' href={article?.affiliateLink}>
          <img src={article?.hero?.url} alt='Hero Image' className='h-64 w-full object-cover md:w-1/2' />
        </a>
        <div className='flex w-full flex-col justify-center md:w-1/2'>
          <h1 className='mb-2 text-3xl font-bold'>{article?.title?.title}</h1>
          <p className='mb-2'>{article?.author}</p>
          <p className='mb-2'>{dayjs(article?.publishedDate).format("MMMM DD, YYYY")}</p>
        </div>
      </div>
      <div>{renderPost(article?.content?.content)}</div>
      <div>
        <a target='_blank' href={article?.affiliateLink}>
          {article?.callToAction?.text}
        </a>
      </div>
    </div>
  );
}
