import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from '../static/images/product.jpg';

function reducer(state, action) {
  switch (action.type) {
    case 'SET':
      return action.data;
    case 'UPDATE_CNT':
      return state.map(p =>
        p.productno === action.productno ? { ...p, cnt: action.cnt } : p
      );
    case 'UPDATE_PRODUCT':
      return state.map(p =>
        p.productno === action.productno ? { ...p, ...action.product } : p
      );
    case 'DELETE_PRODUCT':
      return state.filter(p => p.productno !== action.productno);
    case 'ADD_PRODUCT':
      return [action.product, ...state];
    default:
      return state;
  }
}

function ProductCard({ product, dispatch, isAdmin }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [editProduct, setEditProduct] = useState({
    name: product.product_name,
    description: product.product_description,
    point: product.product_point,
  });

  // 테스트용 하드 코딩
  const memberPoint = 10;

  useEffect(() => {
    setEditProduct({
      name: product.product_name,
      description: product.product_description,
      point: product.product_point,
    });
  }, [product]);

  const handleUpdate = async () => {
    try {
      await axios.put(`/product/update/${product.productno}`, {
        adminno: 1,
        product_name: editProduct.name,
        product_description: editProduct.description,
        product_point: editProduct.point,
      });
      dispatch({
        type: 'UPDATE_PRODUCT',
        productno: product.productno,
        product: {
          product_name: editProduct.name,
          product_description: editProduct.description,
          product_point: editProduct.point,
        },
      });
      setShowEditForm(false);
    } catch {
      alert('수정 실패');
    }
  };

  // 기존 handleIncrease, handleDecrease, handleDelete, handlePurchase 함수는 그대로 유지
  const handleIncrease = async () => {
    try {
      await axios.put(`/product/increaseCnt/${product.productno}`);
      dispatch({ type: 'UPDATE_CNT', productno: product.productno, cnt: product.cnt + 1 });
    } catch {
      alert('수량 증가 실패');
    }
  };

  const handleDecrease = async () => {
    if (product.cnt <= 1) return;
    try {
      await axios.put(`/product/decreaseCnt/${product.productno}`);
      dispatch({ type: 'UPDATE_CNT', productno: product.productno, cnt: product.cnt - 1 });
    } catch {
      alert('수량 감소 실패');
    }
  };

    const handleIncrease10 = async () => {
    try {
        await axios.put(`/product/increaseCnt10/${product.productno}`);
        dispatch({ type: 'UPDATE_CNT', productno: product.productno, cnt: product.cnt + 10 });
    } catch {
        alert('수량 10 증가 실패');
    }
    };

    const handleDecrease10 = async () => {
  // 수량이 1인 경우는 감소하지 않도록 막음
    if (product.cnt === 1) return;

    try {
        await axios.put(`/product/decreaseCnt10/${product.productno}`);
        const newCnt = Math.max(1, product.cnt - 10);
        dispatch({ type: 'UPDATE_CNT', productno: product.productno, cnt: newCnt });
    } catch {
        alert('수량 10 감소 실패');
    }
    };



  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/product/delete/${product.productno}`, { data: { adminno: 1 } });
      dispatch({ type: 'DELETE_PRODUCT', productno: product.productno });
    } catch {
      alert('삭제 실패');
    }
  };

  const handlePurchase = async () => {
  if (product.cnt <= 0) return alert('수량 부족');

  const requiredPoint = product.product_point * product.cnt;
  if (memberPoint < requiredPoint) return alert('포인트 부족');

  try {
    await axios.post(`/product/purchase`, null, {
      params: { memberno: 13, productno: product.productno, cnt: product.cnt },
    });
    alert('구매 성공');

    // 수량 1로 초기화
    dispatch({ type: 'UPDATE_CNT', productno: product.productno, cnt: 1 });

    // 페이지 이동 X (머무름)
  } catch {
    alert('구매 실패');
  }
};

  const cardStyle = {
    background: '#b5d692',
    borderRadius: 12,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    padding: 20,
    flex: '1 0 calc(33.333% - 20px)',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    height: 180,
    boxSizing: 'border-box',
  };

  const imageBoxStyle = {
    width: 120,
    height: 120,
    background: '#fff',
    borderRadius: 8,
    border: '1px solid #ccc',
  };

  const infoBoxStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: '100%',
  };

  const countBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const greenBtn = {
    padding: '6px 12px',
    backgroundColor: '#d4edda',
    color: '#000',
    border: 'none',
    borderRadius: 6,
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const smallBtn = {
    padding: '4px 10px',
    backgroundColor: '#d5e6f5',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  };

    const isPurchaseDisabled = product.cnt <= 0 || memberPoint < product.product_point * product.cnt;

    return (
    <>
        <div style={cardStyle}>
        <div style={imageBoxStyle}>
            <img
                src={product.image_url}
                alt={product.product_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
            />
        </div>
        <div style={infoBoxStyle}>
            {/* 상품 이름, 설명, 수량, 버튼 등 */}
            <div>
            <h4 style={{ fontSize: '24px', margin: '0' }}>{product.product_name}</h4>
            <p style={{ margin: '4px 0' }}>{product.product_description}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
                <p style={{ color: '#ff6600', fontWeight: 'bold', margin: 5 }}>
                {product.product_point * product.cnt}P
                </p>
                <div style={countBoxStyle}>
                <button style={smallBtn} onClick={handleDecrease10}>-10</button>
                <button style={smallBtn} onClick={handleDecrease}>-</button>
                <span>{product.cnt}</span>
                <button style={smallBtn} onClick={handleIncrease}>+</button>
                <button style={smallBtn} onClick={handleIncrease10}>+10</button>
                </div>
            </div>
            </div>

            <div style={{ width: '100%' }}>
            {isAdmin ? (
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    style={{
                    ...smallBtn,
                    backgroundColor: '#007bff',
                    color: 'white',
                    marginRight: 6,
                    }}
                    onClick={() => setShowEditForm(true)}
                >
                    수정
                </button>
                <button
                    style={{
                    ...smallBtn,
                    backgroundColor: '#dc3545',
                    color: 'white',
                    }}
                    onClick={handleDelete}
                >
                    삭제
                </button>
                </div>
            ) : (
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={handlePurchase}
                    disabled={isPurchaseDisabled}
                    style={{
                    padding: '6px 12px',
                    backgroundColor: isPurchaseDisabled ? '#ccc' : '#d4edda',
                    color: isPurchaseDisabled ? '#666' : '#000',
                    border: 'none',
                    borderRadius: 6,
                    cursor: isPurchaseDisabled ? 'not-allowed' : 'pointer',
                    }}
                >
                    구매
                </button>
                </div>
            )}
            </div>
        </div>
        </div>

        {/* ✅ 수정 모달은 여기에서 따로 렌더링 */}
        {showEditForm && (
        <div
            style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
            }}
        >
            <div
            style={{
                background: '#fff',
                padding: 30,
                borderRadius: 10,
                width: 400,
                boxShadow: '0 0 15px rgba(0,0,0,0.3)',
            }}
            >
            <h3>상품 수정</h3>

            <label style={{ fontWeight: 'bold', display: 'block', textAlign: 'left' }}>상품 이름</label>
            <input
                value={editProduct.name}
                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                style={{ width: '100%', marginBottom: 15, padding: 8 }}
            />

            <label style={{ fontWeight: 'bold', display: 'block', textAlign: 'left' }}>상품 설명</label>
            <input
                value={editProduct.description}
                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                style={{ width: '100%', marginBottom: 15, padding: 8 }}
            />

            <label style={{ fontWeight: 'bold', display: 'block', textAlign: 'left' }}>포인트</label>
            <input
                type="number"
                value={editProduct.point}
                onChange={(e) => setEditProduct({ ...editProduct, point: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', marginBottom: 20, padding: 8 }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handleUpdate}>수정 완료</button>
                <button onClick={() => setShowEditForm(false)}>취소</button>
            </div>
            </div>
        </div>
        )}
    </>
    );

}


// ... (기존 import 및 reducer 생략)

function ProductPage() {
  const [products, dispatch] = useReducer(reducer, []);
  const [isAdmin, setIsAdmin] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', point: 0, image_url: null,});
  const navigate = useNavigate();

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get('/product/list_all');
      // 각 상품에 cnt 초기값 1 설정
      const productsWithCnt = res.data.map(product => ({
        ...product,
        cnt: 1,
      }));
      dispatch({ type: 'SET', data: productsWithCnt });
    } catch {
      alert('상품 불러오기 실패');
    }
  };
  fetchProducts();
}, []);

  const handleAddProduct = async () => {
  try {
    const formData = new FormData();
    formData.append('product_name', newProduct.name);
    formData.append('product_description', newProduct.description);
    formData.append('product_point', newProduct.point);
    formData.append('cnt', 1);
    formData.append('image', newProduct.imageFile); // ✅ 파일 자체를 첨부

    const res = await axios.post('/product/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch({ type: 'ADD_PRODUCT', product: res.data });
    setShowAddForm(false);
    setNewProduct({ name: '', description: '', point: 0, imageFile: null });
  } catch (err) {
    alert('상품 추가 실패');
  }
};


  // ✅ dummy 카드 계산
  const fullRowCount = 3;
  const totalItems = isAdmin ? products.length + 1 : products.length;
  const dummyCount = (fullRowCount - (totalItems % fullRowCount)) % fullRowCount;

  return (
    <div
        style={{
            padding: 30,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            boxSizing: 'border-box',
        }}
        >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <h2 style={{fontSize: '36px'}}>포인트 상점</h2>
      </div>

      <div
        style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            maxWidth: 1000,       // ✅ 전체 폭 제한
            margin: '0 auto',     // ✅ 가운데 정렬
            justifyContent: 'center', // ✅ 카드들 가운데로
        }}>
               
        {products.map((product) => (
          <ProductCard key={product.productno} product={product} dispatch={dispatch} isAdmin={isAdmin} />
        ))}

        {isAdmin && (
        <div
            onClick={() => setShowAddForm(true)}
            style={{
            background: '#f0f0f0',                 // 카드 배경 통일
            borderRadius: 12,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // 카드 그림자 통일
            flex: '1 0 calc(33.333% - 20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            height: 180,                            // 카드 높이 통일 (ProductCard 기준)
            cursor: 'pointer',
            border: '1px dashed #aaa',
            fontSize: 48,
            fontWeight: 'bold',
            color: '#aaa',
            }}
        >
            +
        </div>
        )}
        

        {/* ✅ dummy 카드 추가 */}
        {[...Array(dummyCount)].map((_, i) => (
          <div
            key={`dummy-${i}`}
            style={{
              flex: '1 0 calc(33.333% - 20px)',
              height: 240,
              visibility: 'hidden',
            }}
          />
        ))}
      </div>

      <button
          onClick={() => setIsAdmin(!isAdmin)}
          style={{
            padding: '8px 16px',
            backgroundColor: isAdmin ? '#6c757d' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {isAdmin ? '사용자 모드로 전환' : '관리자 모드로 전환'}
        </button>

      {showAddForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', padding: 30, borderRadius: 10, width: 400, boxShadow: '0 0 15px rgba(0,0,0,0.3)' }}>
            <h3>상품 추가</h3>

            <label style={{ fontWeight: 'bold', display: 'block', textAlign: 'left' }}>상품 이름</label>
            <input
              placeholder="상품 이름"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              style={{ width: '100%', marginBottom: 15, padding: 8, textAlign: 'left' }}
            />

            <label style={{ fontWeight: 'bold', display: 'block', textAlign: 'left' }}>상품 설명</label>
            <input
              placeholder="상품 설명"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              style={{ width: '100%', marginBottom: 15, padding: 8, textAlign: 'left' }}
            />

            <label style={{ fontWeight: 'bold', display: 'block', textAlign: 'left' }}>포인트</label>
            <input
              type="number"
              placeholder="포인트"
              value={newProduct.point}
              onChange={(e) =>
                setNewProduct({ ...newProduct, point: parseInt(e.target.value) || 0 })
              }
              style={{ width: '100%', marginBottom: 20, padding: 8, textAlign: 'left' }}
            />
            <label style={{ fontWeight: 'bold', display: 'block', textAlign: 'left' }}>이미지 URL</label>
            <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleAddProduct}>등록</button>
              <button onClick={() => setShowAddForm(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
