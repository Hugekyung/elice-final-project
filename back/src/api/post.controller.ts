import { Router } from "express";
import { PostService } from "@src/service";
import wrapAsyncFunc from "@src/utils/catchAsync";
import { authRequired } from "@src/middlewares/authRequired";
import { commentSchema, postSchema } from "@src/utils/bodySchema";
import { STATUS_200_OK, STATUS_201_CREATED } from "@src/utils/statusCode";
import { bodyValidator, paramsValidator } from "@src/middlewares/requestValidator";
import {
    commentIdentifierSchema,
    identifierSchema,
    postIdentifierSchema,
    userIdentifierSchema,
} from "@src/utils/paramsSchema";

const postController = Router();

postController.get(
    "/posts",
    wrapAsyncFunc(async (req, res, _next) => {
        /*  #swagger.tags = ["post"]
            #swagger.description = "게시글 목록 조회"
            #swagger.parameters['queryString'] = {
                in: 'query',
                description: '**search** 검색어\n
                **type** 검색타입, all, title, content\n
                **pageno** 페이지 번호\n
                **limit** 기본값10\n',
                required: false,
                schema: { $ref: "#/definitions/PostGetQuery" }
            }
            #swagger.responses[200] = {
            schema: { "$ref": "#/definitions/PostGetResponse" },
            description: "게시글 목록을 배열형태로 반환" } */

        const postList = await PostService.getPostList(req.query);
        res.status(STATUS_200_OK).json(postList);
    }),
);

postController.get(
    "/posts/users/:userId",
    paramsValidator(userIdentifierSchema),
    wrapAsyncFunc(async (req, res, _next) => {
        /*  #swagger.tags = ["post"]
            #swagger.description = "사용자의 게시글 목록 조회"
            #swagger.parameters['queryString'] = {
                in: 'query',
                description: '**pageno** 페이지 번호\n
                **limit** 기본값10\n',
                required: false,
                schema: { $ref: "#/definitions/UserPostGetQuery" }
            }
            #swagger.parameters['userId'] = {
                in: 'path',
                description: '게시글을 조회할 유저의 ID',
                required: true,
                schema: { $ref: "#/definitions/UserId" }
            }
            #swagger.responses[200] = {
            schema: { "$ref": "#/definitions/PostGetResponse" },
            description: "게시글 목록을 배열형태로 반환" } */

        const { userId } = req.params;
        const postList = await PostService.getUserPostList(userId, req.query);
        res.status(STATUS_200_OK).json(postList);
    }),
);

postController.get(
    "/posts/:id",
    paramsValidator(identifierSchema),
    wrapAsyncFunc(async (req, res, _next) => {
        /*  #swagger.tags = ["post"]
            #swagger.description = "개별 게시글 정보 조회"
            #swagger.parameters['id'] = {
                in: 'path',
                description: '얻고자 하는 게시글정보의 ID',
                required: true,
                schema: { $ref: "#/definitions/PostId" }
            }
            #swagger.responses[200] = {
            schema: { "$ref": "#/definitions/PostOneGetResponse" },
            description: "게시글 정보를 반환" } */

        const { id } = req.params;
        const postInfo = await PostService.getByPost(id);
        res.status(STATUS_200_OK).json(postInfo);
    }),
);

postController.post(
    "/posts",
    authRequired,
    bodyValidator(postSchema),
    wrapAsyncFunc(async (req, res, _next) => {
        /*  #swagger.tags = ["post"]
            #swagger.description = "게시글 생성 **로그인 필수**"
            #swagger.security = [{
               "bearerAuth": []
            }]
            #swagger.parameters['body'] = {
                in: 'body',
                description: '생성하고자 하는 게시글의 정보를 body에 담아 요청',
                required: true,
                schema: { $ref: "#/definitions/PostCreateRequest" }
            }
            #swagger.responses[201] = {
            schema: { "$ref": "#/definitions/PostCreateResponse" },
            description: "생성된 게시글 정보 반환" } */

        const { currentUserId } = req.cookies;
        const createdPost = await PostService.addPost(currentUserId, req.body);
        res.status(STATUS_201_CREATED).json(createdPost);
    }),
);

postController.post(
    "/posts/:postId/comments",
    authRequired,
    paramsValidator(postIdentifierSchema),
    bodyValidator(commentSchema),
    wrapAsyncFunc(async (req, res, _next) => {
        /*  #swagger.tags = ["post"]
            #swagger.description = "댓글 생성 **로그인 필수**"
            #swagger.security = [{
               "bearerAuth": []
            }]
            #swagger.parameters['postId'] = {
                in: 'path',
                description: '댓글을 달 게시글의 ID',
                required: true,
                schema: { $ref: "#/definitions/PostId" }
            }
            #swagger.parameters['body'] = {
                in: 'body',
                description: '생성하고자 하는 댓글의 정보를 body에 담아 요청',
                required: true,
                schema: { $ref: "#/definitions/CommentCreateRequest" }
            }
            #swagger.responses[201] = {
            schema: { "$ref": "#/definitions/CommentCreateResponse" },
            description: "생성된 댓글 정보 반환" } */

        const { postId } = req.params;
        const { currentUserId } = req.cookies;
        const createdComment = await PostService.addComment(currentUserId, postId, req.body);
        res.status(STATUS_201_CREATED).json(createdComment);
    }),
);

postController.put(
    "/posts/:id",
    authRequired,
    paramsValidator(identifierSchema),
    bodyValidator(postSchema),
    wrapAsyncFunc(async (req, res, _next) => {
        /*  #swagger.tags = ["post"]
            #swagger.description = "게시글 정보 수정 **로그인 필수**"
            #swagger.security = [{
               "bearerAuth": []
            }]
            #swagger.parameters['id'] = {
                in: 'path',
                description: '수정하고자 하는 게시글의 ID',
                required: true,
                schema: { $ref: "#/definitions/PostId" }
            }
            #swagger.parameters['body'] = {
                in: 'body',
                description: '수정하고자 하는 게시글의 정보를 body에 담아 요청',
                required: true,
                schema: { $ref: "#/definitions/PostPutRequest" }
            }
            #swagger.responses[200] = {
            schema: { "$ref": "#/definitions/PostPutResponse" },
            description: "수정된 게시글 정보 반환" } */

        const { id } = req.params;
        const updatedPost = await PostService.updatePost(id, req.body);
        res.status(STATUS_200_OK).json(updatedPost);
    }),
);

postController.put(
    "/posts/:postId/comments/:commentId",
    authRequired,
    paramsValidator(commentIdentifierSchema),
    bodyValidator(commentSchema),
    wrapAsyncFunc(async (req, res, _next) => {
        /*  #swagger.tags = ["post"]
            #swagger.description = "댓글 정보 수정 **로그인 필수**"
            #swagger.security = [{
               "bearerAuth": []
            }]
            #swagger.parameters['postId'] = {
                in: 'path',
                description: '수정하고자 하는 댓글이 달려있는 게시글 ID',
                required: true,
                schema: { $ref: "#/definitions/PostId" }
            }
            #swagger.parameters['commentId'] = {
                in: 'path',
                description: '수정하고자 하는 댓글의 ID',
                required: true,
                schema: { $ref: "#/definitions/CommentId" }
            }
            #swagger.responses[200] = {
            schema: { "$ref": "#/definitions/CommentPutResponse" },
            description: "수정된 댓글 정보를 포함한 게시글 정보 반환" } */

        const { postId, commentId } = req.params;
        const updatedComment = await PostService.updateComment(postId, commentId, req.body);
        res.status(STATUS_200_OK).json(updatedComment);
    }),
);

postController.delete(
    "/posts/:id",
    authRequired,
    paramsValidator(identifierSchema),
    wrapAsyncFunc(async (req, res, _next) => {
        /*  #swagger.tags = ["post"]
            #swagger.description = "게시글 삭제 **로그인 필수**"
            #swagger.security = [{
               "bearerAuth": []
            }]
            #swagger.parameters['id'] = {
                in: 'path',
                description: '삭제하고자 하는 게시글의 ID',
                required: true,
                schema: { $ref: "#/definitions/PostId" }
            }
            #swagger.responses[200] = {
            schema: { "$ref": "#/definitions/DeleteResponse" },
            description: "삭제 메시지" } */

        const { id } = req.params;
        const deletedPost = await PostService.deletePost(id);
        res.status(STATUS_200_OK).json(deletedPost);
    }),
);

postController.delete(
    "/posts/:postId/comments/:commentId",
    authRequired,
    paramsValidator(commentIdentifierSchema),
    wrapAsyncFunc(async (req, res, _next) => {
        /*  #swagger.tags = ["post"]
            #swagger.description = "댓글 삭제 **로그인 필수**"
            #swagger.security = [{
               "bearerAuth": []
            }]
            #swagger.parameters['postId'] = {
                in: 'path',
                description: '삭제하고자 하는 댓글이 달려있는 게시글 ID',
                required: true,
                schema: { $ref: "#/definitions/PostId" }
            }
            #swagger.parameters['commentId'] = {
                in: 'path',
                description: '삭제하고자 하는 댓글의 ID',
                required: true,
                schema: { $ref: "#/definitions/CommentId" }
            }
            #swagger.responses[200] = {
            schema: { "$ref": "#/definitions/DeleteResponse" },
            description: "삭제 메시지" } */

        const { postId, commentId } = req.params;
        const deletedComment = await PostService.deleteComment(postId, commentId);
        res.status(STATUS_200_OK).json(deletedComment);
    }),
);

export default postController;
