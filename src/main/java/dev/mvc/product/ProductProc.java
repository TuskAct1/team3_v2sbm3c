package dev.mvc.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component("dev.mvc.product.ProductProc")
public class ProductProc implements ProductProcInter {
    @Autowired
    private ProductDAOInter productDAO;

    @Override
    public int create(ProductVO productVO) {
        return productDAO.create(productVO);
    }

    @Override
    public ProductVO read(int productno) {
        return productDAO.read(productno);
    }

    @Override
    public int update(ProductVO productVO) {
        return productDAO.update(productVO);
    }

    @Override
    public int delete(int productno, int adminno) {
        Map<String, Object> map = new HashMap<>();
        map.put("productno", productno);
        map.put("adminno", adminno);
        return productDAO.delete(map);
    }

    @Override
    public List<ProductVO> list_all() {
        return productDAO.list_all();
    }

    @Override
    public boolean purchaseProduct(int memberno, int productno, int cnt) {
        Map<String, Object> param = new HashMap<>();
        param.put("memberno", memberno);
        param.put("productno", productno);
        param.put("cnt", cnt);

        // 포인트 차감
        int result = productDAO.purchaseProduct(param);

        if (result == 0) {
            // 포인트 부족 또는 실패
            return false;
        }

        // 상품 수량 증가
        productDAO.updateCnt(Map.of("productno", productno, "cnt", cnt)); // 직접 입력 형태로 변경해도 되고

        // 또는 아래처럼 수량 증가도 가능
        // productDAO.increaseCnt(productno);

        return true;
    }

    @Override
    public int updateCnt(int productno, int cnt) {
        Map<String, Object> map = new HashMap<>();
        map.put("productno", productno);
        map.put("cnt", cnt);
        return productDAO.updateCnt(map);
    }

    @Override
    public int increaseCnt(int productno) {
        return productDAO.increaseCnt(productno);
    }

    @Override
    public int decreaseCnt(int productno) {
        return productDAO.decreaseCnt(productno);
    }

    @Override
    public int increaseCnt10(int productno) {
        return productDAO.increaseCnt10(productno);
    }

    @Override
    public int decreaseCnt10(int productno) {
        return productDAO.decreaseCnt10(productno);
    }
}
