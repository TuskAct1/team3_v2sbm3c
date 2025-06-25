package dev.mvc.product;

import java.util.List;

public interface ProductProcInter {
    // 상품 등록
    public int create(ProductVO productVO);

    // 상품 단일 조회
    public ProductVO read(int productno);

    // 상품 수정
    public int update(ProductVO productVO);

    // 상품 삭제
    public int delete(int productno, int adminno);

    // 상품 전체 조회
    public List<ProductVO> list_all();

    // 상품 구매 (포인트 차감 + 수량 증가)
    public boolean purchaseProduct(int memberno, int productno, int cnt);

    // 수량 직접 입력
    public int updateCnt(int productno, int cnt);

    // 수량 1 증가
    public int increaseCnt(int productno);

    // 수량 1 감소 (0 이하 방지)
    public int decreaseCnt(int productno);

    // 수량 10씩 증가
    public int increaseCnt10(int productno);

    // 수량 10씩 감소 (0 이하 방지)
    public int decreaseCnt10(int productno);
}
