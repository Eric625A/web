import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ImageCropperPage from './pages/ImageCropperPage';
import ImageCompressorPage from './pages/ImageCompressorPage';
import ImageConverterPage from './pages/ImageConverterPage';
import ImageToTextPage from './pages/ImageToTextPage';
import FileConverterPage from './pages/FileConverterPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/image-cropper" element={<ImageCropperPage />} />
        <Route path="/image-compressor" element={<ImageCompressorPage />} />
        <Route path="/image-converter" element={<ImageConverterPage />} />
        <Route path="/image-to-text" element={<ImageToTextPage />} />
        <Route path="/file-converter" element={<FileConverterPage />} />
        {/* 可以添加其他工具页面的路由 */}
      </Routes>
    </Router>
  );
}

export default App;
