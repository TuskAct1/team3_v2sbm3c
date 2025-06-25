package dev.mvc.product;

import java.util.List;
import java.util.Map;

public interface ProductDAOInter {
    // 상품 등록
    public int create(ProductVO productVO);

    // 상품 단일 조회
    public ProductVO read(int productno);

    // 상품 수정
    public int update(ProductVO productVO);

    // 상품 삭제
    public int delete(Map<String, Object> map); // productno, adminno

    // 상품 전체 조회
    public List<ProductVO> list_all();

    // 회원 포인트 차감
    public int purchaseProduct(Map<String, Object> map); // memberno, productno, cnt

    // 상품 수량 직접 입력
    public int updateCnt(Map<String, Object> map); // productno, cnt

    // 수량 1씩 증가
    public int increaseCnt(int productno);

    // 수량 1씩 감소 (0 이하 방지)
    public int decreaseCnt(int productno);

    // 수량 10씩 증가
    public int increaseCnt10(int productno);

    // 수량 10씩 감소 (0 이하 방지)
    public int decreaseCnt10(int productno);

}
