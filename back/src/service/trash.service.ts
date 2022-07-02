import axios from "axios";
import { Trash } from "@src/repository";
import { createAiResult } from "@src/utils/createAiResult";
import { createFilterQuery } from "@src/utils/createQuery";
import { FilterQuery, ITrash } from "@src/models/interface";
import { STATUS_404_NOTFOUND } from "@src/utils/statusCode";
import { RequestError } from "@src/middlewares/errorHandler";

export class TrashService {
    static async getTrashList(query: FilterQuery) {
        const filterList = ["title", "category", "kind"];
        const { filteredQuery, limit } = createFilterQuery(query, filterList);
        const foundTrashList = await Trash.find({ filteredQuery, limit });
        if (!foundTrashList)
            throw new RequestError("쓰레기 목록을 가져올 수 없습니다.", STATUS_404_NOTFOUND);
        return foundTrashList;
    }

    static async getByTrash(id: string) {
        const foundTrashInfo = await Trash.findOne(id);
        if (!foundTrashInfo) throw new RequestError("쓰레기 정보를 가져올 수 없습니다.");
        return foundTrashInfo;
    }

    static async addTrash(trashInfo: ITrash) {
        const createdTrash = await Trash.create(trashInfo);
        if (!createdTrash) throw new RequestError("쓰레기 생성에 실패하였습니다.");
        return createdTrash;
    }

    static async aiTrash(imageUrl: string) {
        const res = await axios.post(process.env.AI_SERVER_URL as string, {
            imageUrl,
        });
        if (!res.data)
            throw new RequestError("AI 분석 결과를 찾을 수 없습니다.", STATUS_404_NOTFOUND);
        return createAiResult(res.data);
    }

    static async updateTrash(id: string, trashInfo: ITrash) {
        const updatedTrash = await Trash.update(id, trashInfo);
        if (!updatedTrash) throw new RequestError("해당 쓰레기를 찾을 수 없습니다.");
        return updatedTrash;
    }

    static async deleteTrash(id: string) {
        const deletedTrash = await Trash.delete(id);
        if (!deletedTrash) throw new RequestError("해당 쓰레기를 찾을 수 없습니다.");
        return { message: "삭제가 완료되었습니다." };
    }
}
