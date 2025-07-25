package dev.mvc.point;

public interface PointProcInter {
    public void addPoint(int memberno, int amount);  // 포인트 추가
    public int subtractPoint(int memberno, int amount); // 포인트 차감 등 나중에 쓸 수 있음
    public PointVO readByMemberno(int memberno);
    public int updateAmount(int memberno, int amount, String reason);
    int add(int memberno, int amount);
    public int increase(int memberno, int amount);
    public int decrease(int memberno, int amount);
    public int adjustPoint(int memberno, int pointChange);
}