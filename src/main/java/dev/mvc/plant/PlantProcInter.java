package dev.mvc.plant;

public interface PlantProcInter {

    /** 반려 식물 등록 */
    public int create(PlantVO plantVO);

    /** 회원 식물 조회 */
    public PlantVO read(int plantno);

    /** 식물 성장도 증가 */
    public int update(PlantVO plantVO);

    /** 식물 삭제 */
    public int delete(int plantno);
}
