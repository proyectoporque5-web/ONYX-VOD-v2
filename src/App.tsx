/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { MediaDetail } from './pages/MediaDetail';
import { Search } from './pages/Search';
import { Player } from './pages/Player';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/media/:type/:id" element={<MediaDetail />} />
        <Route path="/player/webview" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}
