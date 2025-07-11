import React, { useEffect, useState } from "react";
import axios from "axios";

function FaqListPage() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    axios.get('/faq/list').then(res => setFaqs(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-6">자주 묻는 질문</h2>
      {faqs.map(faq => (
        <div key={faq.faqno} className="border-b pb-4 mb-4">
          <div className="font-semibold">{faq.question}</div>
          <div className="text-gray-700 mb-2">{faq.answer}</div>
          {faq.files && faq.files.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {faq.files.map(f =>
                <img
                  key={f.fileno}
                  src={`/upload/path/${f.savedname}`} // 실제 파일경로에 맞게
                  alt={f.filename}
                  style={{ width: 140, borderRadius: 8 }}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FaqListPage;
