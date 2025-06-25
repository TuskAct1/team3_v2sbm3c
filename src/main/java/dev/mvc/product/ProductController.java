package dev.mvc.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    @Qualifier("dev.mvc.product.ProductProc")
    private ProductProcInter productProc;

    @PostMapping(path = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam("product_name") String name,
            @RequestParam("product_description") String description,
            @RequestParam("product_point") int point,
            @RequestParam("cnt") int cnt,
            @RequestParam("image") MultipartFile imageFile
    ) {
        String uploadDir = "C:/upload/product/";
        String filename = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        File target = new File(uploadDir + filename);

        try {
            imageFile.transferTo(target); // 실제 업로드
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 업로드 실패");
        }

        ProductVO vo = new ProductVO();
        vo.setAdminno(1); // 관리자
        vo.setMemberno(13);
        vo.setProduct_name(name);
        vo.setProduct_description(description);
        vo.setProduct_point(point);
        vo.setCnt(cnt);
        vo.setImage_url("/upload/product/" + filename); // ✅ DB에 저장될 이미지 경로

        int result = productProc.create(vo);
        if (result == 1) {
            return ResponseEntity.ok(vo);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품 등록 실패");
        }
    }




    // 2. 상품 전체 조회
    @GetMapping("/list_all")
    public ResponseEntity<?> listAll() {
        long start = System.currentTimeMillis();
        List<ProductVO> list = productProc.list_all();
        long end = System.currentTimeMillis();
        System.out.println("▶ 상품 리스트 조회 시간: " + (end - start) + "ms");
        return ResponseEntity.ok(list);
    }

    // 3. 상품 단건 조회
    @GetMapping("/read/{productno}")
    public ResponseEntity<?> read(@PathVariable("productno") int productno) {
        ProductVO productVO = productProc.read(productno);
        if (productVO != null) {
            return ResponseEntity.ok(productVO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("상품을 찾을 수 없습니다.");
        }
    }

    // 4. 상품 수정
    @PutMapping("/update/{productno}")
    public ResponseEntity<?> update(@PathVariable("productno") int productno,
                                    @RequestBody ProductVO productVO) {
        productVO.setProductno(productno);
        productVO.setAdminno(1);

        int result = productProc.update(productVO);
        if (result == 1) {
            return ResponseEntity.ok("상품 수정 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품 수정 실패");
        }
    }

    // 5. 상품 삭제
    @DeleteMapping("/delete/{productno}")
    public ResponseEntity<?> delete(@PathVariable("productno") int productno,
                                    @RequestBody Map<String, Object> map) {
        int adminno = (int) map.get("adminno");
        int result = productProc.delete(productno, adminno);
        if (result == 1) {
            return ResponseEntity.ok("상품 삭제 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품 삭제 실패");
        }
    }

    // 6. 수량 직접 수정
    @PutMapping("/updateCnt/{productno}")
    public ResponseEntity<?> updateCnt(@PathVariable("productno") int productno,
                                       @RequestParam int cnt) {
        int result = productProc.updateCnt(productno, cnt);
        if (result == 1) {
            return ResponseEntity.ok("수량 수정 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수량 수정 실패");
        }
    }

    // 7. 수량 1 증가
    @PutMapping("/increaseCnt/{productno}")
    public ResponseEntity<?> increaseCnt(@PathVariable("productno") int productno) {
        int result = productProc.increaseCnt(productno);
        if (result == 1) {
            return ResponseEntity.ok("수량 증가 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수량 증가 실패");
        }
    }

    // 8. 수량 1 감소
    @PutMapping("/decreaseCnt/{productno}")
    public ResponseEntity<?> decreaseCnt(@PathVariable("productno") int productno) {
        int result = productProc.decreaseCnt(productno);
        if (result == 1) {
            return ResponseEntity.ok("수량 감소 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수량 감소 실패");
        }
    }

    // 9. 수량 10 증가
    @PutMapping("/increaseCnt10/{productno}")
    public ResponseEntity<?> increaseCnt10(@PathVariable("productno") int productno) {
        int result = productProc.increaseCnt10(productno);
        if (result == 1) {
            return ResponseEntity.ok("수량 증가 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수량 증가 실패");
        }
    }

    // 10. 수량 10 감소
    @PutMapping("/decreaseCnt10/{productno}")
    public ResponseEntity<?> decreaseCnt10(@PathVariable("productno") int productno) {
        int result = productProc.decreaseCnt10(productno);
        if (result == 1) {
            return ResponseEntity.ok("수량 감소 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수량 감소 실패");
        }
    }

    // 9. 상품 구매 (포인트 차감 + 수량 증가)
    @PostMapping("/purchase")
    public ResponseEntity<?> purchase(@RequestParam int memberno,
                                      @RequestParam int productno,
                                      @RequestParam int cnt) {
        boolean success = productProc.purchaseProduct(memberno, productno, cnt);
        if (success) {
            return ResponseEntity.ok("구매 성공");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("포인트 부족 또는 구매 실패");
        }
    }
}
