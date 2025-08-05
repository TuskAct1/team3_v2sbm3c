import axios from 'axios';

// 식물 생성
export const createPlant = async (plantData) => {
  const res = await axios.post('http://121.78.128.139:9093/api/plants/create', plantData);
  return res.data;
};

// 식물 목록 조회
export const fetchPlants = async (memberno) => {
  const res = await axios.get('http://121.78.128.139:9093/api/plants/list', {
    params: { memberno }
  });
  return res.data;
};

// 성장 로그 기록
export const insertGrowthLog = async (logData) => {
  const res = await axios.post('http://121.78.128.139:9093/api/plant-growth/insert', logData);
  return res.data;
};

// 성장률 업데이트
export const updateGrowth = async (data) => {
  const res = await axios.post('http://121.78.128.139:9093/api/plants/update-growth', data);
  return res.data;
};

// 포인트 차감
export const updateMemberPoint = async (data) => {
  const res = await axios.post('http://121.78.128.139:9093/api/members/update-point', data);
  return res.data;
};