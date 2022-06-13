import { Router } from "express";
import wrapAsyncFunc from "@src/utils/catchAsync";
import { INews } from "@src/utils/types/interface";
import { newsSchema } from "@src/utils/bodySchema";
import { newsService } from "@src/service/news.service";
import { bodyValidator } from "@src/middlewares/bodyValidator";
import { STATUS_200_OK, STATUS_201_CREATED } from "@src/utils/statusCode";

const newsController = Router();

newsController.get(
    "/news",
    wrapAsyncFunc(async (req, res, _next) => {
        /*  #swagger.tags = ["news"]
            #swagger.description = "뉴스 목록 조회"
            #swagger.parameters['queryString'] = {
                in: 'query',
                description: '**search** 검색어\n
                **page** 첫 요청시 빈 문자열 또는 생략\n
                **limit** 기본값\n',
                required: false,
                schema: { $ref: "#/definitions/NewsGetQuery" }
            }
            #swagger.responses[200] = {
            schema: { "$ref": "#/definitions/NewsGetResponse" },
            description: "뉴스 목록을 배열형태로 반환" } */

        const newsList = await newsService.getNewsList(req.query);
        res.status(STATUS_200_OK).json(newsList);
    }),
);

newsController.post(
    "/news",
    bodyValidator(newsSchema),
    wrapAsyncFunc(async (req, res, _next) => {
        /*  #swagger.tags = ["news"]
            #swagger.description = "뉴스 생성"
            #swagger.parameters['body'] = {
                in: 'body',
                description: '생성하고자 하는 뉴스의 정보를 body에 담아 요청',
                required: true,
                schema: { $ref: "#/definitions/NewsPostQuery" }
            }
            #swagger.responses[201] = { 
            schema: { "$ref": "#/definitions/NewsPostResponse" },
            description: "생성된 뉴스 정보 반환" } */

        const newsInfo: INews = req.body;
        const createdNews = await newsService.addNews(newsInfo);
        res.status(STATUS_201_CREATED).json(createdNews);
    }),
);

newsController.put(
    "/news/:id",
    bodyValidator(newsSchema),
    wrapAsyncFunc(async (req, res, _next) => {
        /*  #swagger.tags = ["news"]
            #swagger.description = "뉴스 수정"
            #swagger.parameters['id'] = {
                in: 'path',
                description: '수정하고자 하는 뉴스의 ID',
                required: true,
                schema: { $ref: "#/definitions/NewsId" }
            }
            #swagger.parameters['body'] = {
                in: 'body',
                description: '수정하고자 하는 뉴스의 정보를 body에 담아 요청',
                required: true,
                schema: { $ref: "#/definitions/NewsPutBody" }
            }
            #swagger.responses[200] = { 
            schema: { "$ref": "#/definitions/NewsPutResponse" },
            description: "수정된 뉴스 정보 반환" } */

        const { id } = req.params;
        const newsInfo: INews = req.body;
        const updatedNews = await newsService.updateNews(id, newsInfo);
        res.status(STATUS_200_OK).json(updatedNews);
    }),
);

newsController.delete(
    "/news/:id",
    wrapAsyncFunc(async (req, res, _next) => {
        /*  #swagger.tags = ["news"]
            #swagger.description = "뉴스 삭제"
            #swagger.parameters['id'] = {
                in: 'path',
                description: '삭제하고자 하는 뉴스의 ID',
                required: true,
                schema: { $ref: "#/definitions/NewsId" }
            }
            #swagger.responses[200] = { 
            schema: { "$ref": "#/definitions/NewsDeleteResponse" },
            description: "삭제 메시지" } */

        const { id } = req.params;
        const deleteResult = await newsService.deleteNews(id);
        res.status(STATUS_200_OK).json(deleteResult);
    }),
);

export default newsController;
