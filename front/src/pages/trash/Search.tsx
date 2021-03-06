import { FormEvent, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { getData } from "../../api";
import { searchTrashState } from "../../stores/atoms";
import {
  DropDownBox,
  DropDownItem,
  SearchBox,
  SearchButton,
  SearchText,
  SearchTrashImg,
  ResetIcon,
} from "../../styles/trash/search";
import { Search as SearchIcon } from "@mui/icons-material";
import { img } from "../../assets/imgImport";
import { customToastify } from "../../components/customToastify";

function Search() {
  const [search, setSearch] = useState("");
  const [searchReq, setSearchReq] = useState("");
  const [trashList, setTrashList] = useRecoilState(searchTrashState);
  const [isInputValue, setIsInputValue] = useState(false);
  const navigate = useNavigate();

  const getTrash = async () => {
    try {
      const res = await getData(`trash?search=${search}`);
      setTrashList(res.data);
    } catch (err: any) {
      customToastify("error", err.message);
    }
  };

  const onChangeSearch = (e: {
    preventDefault: () => void;
    target: { value: SetStateAction<string> };
  }) => {
    e.preventDefault();
    setSearch(e.target.value);
    setTimeout(async () => {
      setSearchReq(e.target.value);
    }, 2000);
  };

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getTrash();
    navigate(`trash?search=${search}`);
  };

  const showDropDownList = () => {
    if (search === "") {
      setTrashList([]);
      setIsInputValue(false);
    }
    setIsInputValue(false);
  };

  const listReset = () => {
    setSearch("");
    navigate("/category");
    setSearchReq("");
  };

  useEffect(() => {
    showDropDownList();
  }, [search]);

  useEffect(() => {
    if (searchReq !== "") {
      getTrash();
      setIsInputValue(true);
    }
  }, [searchReq]);

  return (
    <div>
      <SearchBox onSubmit={(e) => onSearch(e)}>
        <SearchText
          type="text"
          value={search}
          onChange={onChangeSearch}
          placeholder="????????? ??????"
        />
        {search !== "" ? (
          isInputValue ? (
            <ResetIcon
              src={img.x}
              alt="icon"
              onClick={() => {
                listReset();
              }}
            ></ResetIcon>
          ) : (
            <ResetIcon src={img.loading} alt="icon"></ResetIcon>
          )
        ) : (
          <ResetIcon visibility="hidden" />
        )}
        <SearchButton type="submit">
          <SearchIcon style={{ fontSize: "1rem" }}></SearchIcon>
        </SearchButton>
        {isInputValue && (
          <DropDownBox>
            {trashList.length === 0 ? (
              <DropDownItem>????????? ??????????????????!</DropDownItem>
            ) : (
              <>
                {trashList.map((trash, index) => (
                  <DropDownItem
                    key={index}
                    onClick={() => navigate(`/trash/${trash._id}`)}
                  >
                    <SearchTrashImg src={trash.image} />
                    {trash.title}
                  </DropDownItem>
                ))}
              </>
            )}
          </DropDownBox>
        )}
      </SearchBox>
    </div>
  );
}

export default Search;
