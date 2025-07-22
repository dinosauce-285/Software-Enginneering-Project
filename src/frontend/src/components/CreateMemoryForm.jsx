// src/frontend/components/CreateMemoryForm.jsx
import React, { useState, useEffect } from 'react';
import { createMemory, getEmotions } from '../services/api';

const CreateMemoryForm = ({ onMemoryCreated }) => {
  // State cho các trường input của form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [emotionID, setEmotionID] = useState('');

  // State để quản lý danh sách emotions từ API
  const [emotions, setEmotions] = useState([]);
  
  // State để quản lý trạng thái của form
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sử dụng useEffect để gọi API lấy danh sách emotions khi component được render lần đầu
  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const data = await getEmotions();
        setEmotions(data);
        // Tự động chọn emotion đầu tiên trong danh sách làm giá trị mặc định
        if (data && data.length > 0) {
          setEmotionID(data[0].emotionID);
        }
      } catch (err) {
        console.error('Failed to fetch emotions:', err);
        // Hiển thị lỗi cho người dùng nếu không thể tải danh sách cảm xúc
        setError('Could not load emotions. Please try refreshing the page.');
      }
    };

    fetchEmotions();
  }, []); // Mảng rỗng [] đảm bảo useEffect chỉ chạy 1 lần duy nhất

  // Hàm xử lý khi người dùng submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Kiểm tra emotionID đã được chọn chưa
    if (!emotionID) {
      setError('Please select an emotion.');
      return;
    }

    setError(null);
    setIsLoading(true);

    // Chuyển chuỗi tags thành mảng, loại bỏ khoảng trắng và các tag rỗng
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const memoryData = {
      title,
      content,
      emotionID,
      tags: tagsArray,
    };
    
    try {
      const newMemory = await createMemory(memoryData);
      console.log('Memory created successfully:', newMemory);
      
      // Thông báo cho component cha rằng đã tạo memory thành công
      if (onMemoryCreated) {
        onMemoryCreated(newMemory);
      }
      
      // Reset các trường của form sau khi tạo thành công
      setTitle('');
      setContent('');
      setTags('');
      // Giữ lại emotion đã chọn cho lần tạo tiếp theo nếu muốn

    } catch (err) {
      console.error('Failed to create memory:', err);
      // Hiển thị thông báo lỗi từ backend hoặc một thông báo chung
      setError(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Create a New Memory</h2>
      
      <div>
        <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      
      <div>
        <label htmlFor="content" style={{ display: 'block', marginBottom: '5px' }}>Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box', resize: 'vertical' }}
        />
      </div>

      <div>
        <label htmlFor="emotion" style={{ display: 'block', marginBottom: '5px' }}>Emotion</label>
        <select
          id="emotion"
          value={emotionID}
          onChange={(e) => setEmotionID(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          disabled={emotions.length === 0} // Vô hiệu hóa nếu chưa tải xong
        >
          {emotions.length === 0 && <option>Loading emotions...</option>}
          {emotions.map(emotion => (
            <option key={emotion.emotionID} value={emotion.emotionID}>
              {emotion.symbol} {emotion.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="tags" style={{ display: 'block', marginBottom: '5px' }}>Tags (comma separated)</label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. travel, family, fun"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      <button type="submit" disabled={isLoading} style={{ padding: '12px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px' }}>
        {isLoading ? 'Saving...' : 'Save Memory'}
      </button>
    </form>
  );
};

export default CreateMemoryForm;