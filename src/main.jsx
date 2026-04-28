import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './check-table/App.jsx'
import './index.css'

// check-table React 앱을 패널 div에 마운트
// panel은 CSS display:none 상태여도 React는 정상 렌더링하고,
// switchTab('check-table') 호출 시 .active 클래스가 붙어 보이게 됨
const root = document.getElementById('check-table-root')
if (root) {
  createRoot(root).render(React.createElement(App))
}
