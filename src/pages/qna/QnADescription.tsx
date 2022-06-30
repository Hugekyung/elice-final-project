import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";

import { Viewer } from "@toast-ui/react-editor";

import { getData, delData } from "../../api";

import { QnAType } from "../../types/QnA";

import { useRecoilValue } from "recoil";
import { userState } from "../../stores/atoms";

import QnAComment from "./QnAComment";

import { Container } from "../../styles/basicStyle";
import { TitleText } from "../../styles/TextStyle";
import {
  BlackHr,
  GrayHr,
  TitleContainer,
  Title,
  RightContainer,
  Author,
  Date,
  ContentContainer,
  ButtonWrapper,
  GrayButton,
  RedButton,
  SquareButton,
  ButtonContainer,
} from "../../styles/qnaStyles/QnADescriptionStyle";
import { customToastify } from "../../components/customToastify";
import { Helmet } from "react-helmet-async";
import Loading from "../../components/Loading";

function QnADescription() {
  const navigate = useNavigate();

  // 게시글 id
  const id = useParams().id;

  // 로그인한 사용자
  const user = useRecoilValue(userState);

  const [qna, setQna] = useState<QnAType>();
  const [loading, setLoading] = useState(false);

  const getQnA = async () => {
    try {
      await getData(`posts/${id}`).then((res) => setQna(res.data));
    } catch (err: any) {
      customToastify("error", err.message);
    }
    setLoading(true);
  };

  const date = (prop: any) => {
    return prop?.split("T")[0].split("-").join(".");
  };

  const onClickDelete = async () => {
    try {
      await delData(`posts/${id}`);

      navigate(`/qna`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getQnA();
  }, []);

  if (!loading) {
    return <Loading />;
  }

  return (
    <Container>
      <Helmet>
        <title>분리수ZIP - {qna?.title}</title>
      </Helmet>
      <TitleText>Q&A</TitleText>
      <BlackHr />
      <TitleContainer>
        <Title>{qna?.title}</Title>
        <RightContainer>
          <Date>
            <span>{date(qna?.createdAt)}</span>
          </Date>
          <Author>{qna?.author?.username}</Author>
        </RightContainer>
      </TitleContainer>
      <GrayHr />
      {qna?.content && (
        <ContentContainer>
          <Viewer initialValue={qna?.content} />
        </ContentContainer>
      )}
      <BlackHr />
      <>
        {/* 현재 로그인한 사용자가 게시글의 작성자일 시 */}
        {user._id === qna?.author._id && (
          <ButtonWrapper>
            <GrayButton onClick={() => navigate(`edit/`)}>수정</GrayButton>
            <RedButton onClick={onClickDelete}>삭제</RedButton>
          </ButtonWrapper>
        )}
      </>
      <QnAComment />
      <BlackHr />
      <ButtonContainer>
        <SquareButton onClick={() => navigate(`/qna/`)}>목록</SquareButton>
      </ButtonContainer>
    </Container>
  );
}

export default QnADescription;
