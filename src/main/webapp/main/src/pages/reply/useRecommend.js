import { useState } from 'react';
import axios from 'axios';

export default function useRecommend(replies, setReplies) {
  const handleRecommend = (reply) => {
    // 추천 여부 확인
    axios.get(`/replyRecommend/hartCnt?replyno=${reply.replyno}`, { withCredentials: true })
      .then((res) => {
        if (res.data > 0) {
          // 이미 추천했으면 추천 취소 시도
          axios.delete(`/replyRecommend/delete_by_reply_member/${reply.replyno}`, { withCredentials: true })
            .then((res) => {
              if (res.data > 0) {
                alert('추천이 취소되었습니다.');
                // 상태 업데이트
                setReplies((prevReplies) =>
                  prevReplies.map((r) =>
                    r.replyno === reply.replyno
                      ? {
                          ...r,
                          recommendCount: Math.max((r.recommendCount || 1) - 1, 0),
                          isRecommended: false,
                        }
                      : r
                  )
                );
              } else {
                alert('추천 취소 실패');
              }
            })
            .catch((err) => {
              console.error('추천 취소 실패:', err);
              alert('추천 취소 중 오류가 발생했습니다.');
            });
        } else {
          // 추천 안 했으면 추천 등록
          axios.post('/replyRecommend/create_session', { replyno: reply.replyno }, { withCredentials: true })
            .then((res) => {
              if (res.data === 1) {
                alert('추천이 등록되었습니다.');
                // 상태 업데이트
                setReplies((prevReplies) =>
                  prevReplies.map((r) =>
                    r.replyno === reply.replyno
                      ? {
                          ...r,
                          recommendCount: (r.recommendCount || 0) + 1,
                          isRecommended: true,
                        }
                      : r
                  )
                );
              } else {
                alert('추천 등록 실패');
              }
            })
            .catch((err) => {
              console.error('추천 등록 실패:', err);
              alert('추천 등록 중 오류가 발생했습니다.');
            });
        }
      })
      .catch((err) => {
        console.error('추천 상태 확인 실패:', err);
      });
  };

  return { handleRecommend };
}
