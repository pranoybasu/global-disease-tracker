# 🧪 Testing Guide - Global Disease Tracker

This guide provides a comprehensive testing checklist for the Global Disease Tracker application. Follow each section systematically to ensure all features work correctly.

## 🚀 Prerequisites

1. **Dev Server Running**: Ensure `npm run dev` is running
2. **Browser**: Open http://localhost:5173 in Chrome/Firefox
3. **DevTools**: Keep browser DevTools open (F12) to monitor console errors
4. **Network Tab**: Monitor API calls and React Query cache

---

## 📋 Testing Checklist

### 1. Disease Switching & Data Loading

#### Test Each Disease Selection
- [ ] **COVID-19**
  - [ ] Header icon shows virus icon with red gradient
  - [ ] Global stats load (cases, deaths, recovered, active)
  - [ ] Map markers appear with red color scheme
  - [ ] Top 10 countries list populates with flags
  - [ ] Animation plays smoothly (icon rotate, fade in/out)

- [ ] **Influenza**
  - [ ] Header icon shows wind icon with blue gradient
  - [ ] Data updates to Influenza statistics
  - [ ] Map markers change to blue color scheme
  - [ ] Country list updates
  - [ ] Smooth transition animation

- [ ] **Mpox**
  - [ ] Header icon shows shield icon with purple gradient
  - [ ] Data updates to Mpox statistics
  - [ ] Map markers change to purple color scheme
  - [ ] Country list updates
  - [ ] Animation sequence completes

- [ ] **Malaria**
  - [ ] Header icon shows bug icon with green gradient
  - [ ] Data updates to Malaria statistics
  - [ ] Map markers change to green color scheme
  - [ ] Country list updates
  - [ ] Color transitions work

- [ ] **Dengue**
  - [ ] Header icon shows droplet icon with orange gradient
  - [ ] Data updates to Dengue statistics
  - [ ] Map markers change to orange color scheme
  - [ ] Country list updates
  - [ ] All animations smooth

#### Verify State Persistence
- [ ] Select a disease (e.g., Influenza)
- [ ] Refresh the page (F5)
- [ ] Confirm Influenza is still selected after reload
- [ ] Check localStorage in DevTools → Application → Local Storage
- [ ] Verify `disease-tracker-storage` key contains `selectedDisease`

---

### 2. Map Control Panel Features

#### Display Mode Controls
- [ ] **Cumulative Mode**
  - [ ] Select "Cumulative" from Display Mode dropdown
  - [ ] Verify map shows total cases (larger numbers)
  - [ ] "Show Projected Cases" checkbox appears
  - [ ] Toggle projected cases on/off

- [ ] **Momentum 24h**
  - [ ] Select "Momentum (24h)"
  - [ ] Verify map shows 24-hour change data
  - [ ] Marker sizes adjust to smaller values
  - [ ] "Show Projected Cases" checkbox disappears

- [ ] **Momentum 3d**
  - [ ] Select "Momentum (3 Days)"
  - [ ] Verify map shows 3-day trend
  - [ ] Marker sizes appropriate

- [ ] **Momentum 7d**
  - [ ] Select "Momentum (7 Days)"
  - [ ] Verify map shows weekly trend
  - [ ] Data updates correctly

#### Map Style Controls
- [ ] **Light Style**
  - [ ] Select "Light" from Map Style dropdown
  - [ ] Verify map tiles change to light theme
  - [ ] Markers remain visible on light background

- [ ] **Color Style**
  - [ ] Select "Color"
  - [ ] Verify map shows colorful tiles
  - [ ] Check marker visibility

- [ ] **Dark Style**
  - [ ] Select "Dark"
  - [ ] Verify map switches to dark theme
  - [ ] Markers stand out on dark background

#### Scale Mode Controls
- [ ] **Linear Scale**
  - [ ] Select "Linear" from Scale Mode
  - [ ] Verify marker sizes scale linearly with case counts
  - [ ] Smaller countries have proportionally smaller markers

- [ ] **Logarithmic Scale**
  - [ ] Select "Logarithmic"
  - [ ] Verify marker sizes compress (large differences less dramatic)
  - [ ] Small case counts become more visible

#### Other Controls
- [ ] **Normalize by Population**
  - [ ] Toggle "Normalize by Population" on
  - [ ] Verify stats change to "per million" format
  - [ ] Country rankings may shift (smaller countries rise)
  - [ ] Toggle off, verify raw numbers return

- [ ] **Marker Size Slider**
  - [ ] Drag slider from minimum (20) to maximum (100)
  - [ ] Verify all map markers resize in real-time
  - [ ] Test intermediate values (50, 75)
  - [ ] Confirm smooth transitions

- [ ] **Panel Collapse/Expand**
  - [ ] Click collapse button (chevron icon)
  - [ ] Verify panel collapses to minimize width
  - [ ] Map expands to fill space
  - [ ] Click expand button
  - [ ] Panel smoothly returns to full width

---

### 3. Data Display Accuracy

#### Global Statistics Cards
- [ ] **Total Cases Card**
  - [ ] Shows large number (e.g., "150,234,567")
  - [ ] "Today" incremental shows with + sign
  - [ ] Color matches selected disease theme
  - [ ] Icon appropriate for metric

- [ ] **Total Deaths Card**
  - [ ] Shows accurate death count
  - [ ] Today's deaths increment shown
  - [ ] Red/danger color scheme
  - [ ] Skull icon displayed

- [ ] **Recovered Card**
  - [ ] Shows recovery count
  - [ ] Today's recoveries shown
  - [ ] Green/success color
  - [ ] Heart icon displayed

- [ ] **Active Cases Card**
  - [ ] Shows current active cases
  - [ ] Calculated correctly (cases - deaths - recovered)
  - [ ] Today's change shown (can be negative)
  - [ ] Activity icon displayed

#### Top 10 Countries List
- [ ] **Sorting**
  - [ ] Countries ordered by case count (descending)
  - [ ] Top country has highest number
  - [ ] 10th country has 10th highest number

- [ ] **Country Flags**
  - [ ] Each country shows correct flag emoji
  - [ ] Flags render properly (no broken characters)

- [ ] **Statistics Format**
  - [ ] Numbers formatted with commas (e.g., "1,234,567")
  - [ ] Per million calculation accurate (when normalized)

- [ ] **Change Indicators**
  - [ ] Today's change shows with + or - prefix
  - [ ] Color coding (red for increase, green for decrease in some contexts)

---

### 4. Animations & Performance

#### Header Animations
- [ ] **Disease Switch Animation**
  - [ ] Icon rotates smoothly (360° turn)
  - [ ] Gradient color transitions seamlessly
  - [ ] Title fades out then fades in
  - [ ] Description updates with animation
  - [ ] No layout shift during animation

#### Stat Cards Animation
- [ ] **Staggered Appearance**
  - [ ] Cards appear sequentially (not all at once)
  - [ ] Delay between each card (~100ms)
  - [ ] Smooth fade-in + slide-up effect
  - [ ] No jank or stuttering

#### Country Cards Animation
- [ ] **Sequential Slide-In**
  - [ ] Cards slide in from right
  - [ ] Staggered timing (incremental delays)
  - [ ] Smooth motion without lag

#### Performance Metrics
- [ ] Open Chrome DevTools → Performance
- [ ] Record during disease switch
- [ ] Check FPS stays above 30 (ideally 60)
- [ ] No long tasks (>50ms) blocking UI
- [ ] Memory doesn't spike excessively

---

### 5. Loading States

#### Initial Page Load
- [ ] **Skeleton UI**
  - [ ] Header skeleton appears immediately
  - [ ] 4 stat card skeletons in grid
  - [ ] Map placeholder shown
  - [ ] Country list skeletons displayed
  - [ ] No flash of empty content

#### Disease Switch Loading
- [ ] **Transition States**
  - [ ] Previous data fades out
  - [ ] Skeleton appears briefly during fetch
  - [ ] New data fades in
  - [ ] Smooth transition overall

#### Skeleton Structure
- [ ] Skeleton matches actual content layout
- [ ] No layout shift when data loads
- [ ] Placeholder sizes appropriate

---

### 6. Error Handling

#### API Error Simulation
- [ ] **Network Disconnection**
  - [ ] Open DevTools → Network tab
  - [ ] Set throttling to "Offline"
  - [ ] Refresh page or switch disease
  - [ ] Verify error UI appears:
    - Alert icon with red/destructive styling
    - Clear error message
    - "Retry" button visible
  - [ ] Click "Retry" button
  - [ ] Restore network
  - [ ] Verify data loads successfully

#### Map Error Boundary
- [ ] **Isolated Error Handling**
  - [ ] If map fails to load (Leaflet error)
  - [ ] Rest of app remains functional:
    - Header still works
    - Stats cards still display
    - Country list still visible
    - Disease selector operational
  - [ ] Map section shows fallback UI:
    - Error icon
    - "Something went wrong" message
    - Try switching diseases to reset

#### Console Errors
- [ ] Check browser console for errors
- [ ] Verify no React warnings (e.g., key props, deprecated APIs)
- [ ] Confirm React Query DevTools shows healthy state

---

### 7. React Query Caching & Refetch

#### Cache Behavior
- [ ] **Initial Load**
  - [ ] Open React Query DevTools (browser extension or `http://localhost:5173/__react-query-devtools__`)
  - [ ] Select COVID-19
  - [ ] Verify query state: `success`, data cached

- [ ] **Disease Switch**
  - [ ] Switch to Influenza
  - [ ] Check if data is cached (instant load) or fetched (brief loading)
  - [ ] Verify query key updates: `['disease-data', 'influenza']`

- [ ] **Background Refetch**
  - [ ] Wait 5 minutes (COVID-19 refetch interval)
  - [ ] Watch DevTools for background refetch
  - [ ] Verify data updates silently (no skeleton UI)
  - [ ] Check "Data updated" timestamp if present

#### Retry Logic
- [ ] **Failed Fetch**
  - [ ] Simulate network failure
  - [ ] Observe retry attempts in DevTools Network tab
  - [ ] Should retry 3 times with exponential backoff
  - [ ] After 3 failures, show error UI

---

### 8. Responsive Design Testing

#### Mobile (320px - 768px)
- [ ] **Open DevTools → Toggle Device Toolbar**
- [ ] **Select iPhone SE (375x667)**
  - [ ] Header layout stacks vertically
  - [ ] Icon + title + description readable
  - [ ] Stat cards display in 1 column
  - [ ] Control panel width appropriate
  - [ ] Map visible and touch-scrollable
  - [ ] Country cards in 1 column
  - [ ] Footer text wraps properly

- [ ] **Test Landscape Orientation**
  - [ ] Rotate to landscape (667x375)
  - [ ] Verify layout adapts
  - [ ] Map gets more horizontal space

#### Tablet (768px - 1024px)
- [ ] **Select iPad (768x1024)**
  - [ ] Header layout optimized
  - [ ] Stat cards in 2 columns
  - [ ] Control panel + map side-by-side
  - [ ] Country cards in 2 columns
  - [ ] Touch controls work (tap, swipe)

#### Desktop (1024px+)
- [ ] **Resize to 1920x1080**
  - [ ] Stat cards in 4 columns
  - [ ] Full control panel visible
  - [ ] Map takes maximum space
  - [ ] Country cards in 2-3 columns
  - [ ] Hover states work on cards
  - [ ] All animations smooth at 60fps

#### Responsive Breakpoints
- [ ] Slowly resize browser from 320px to 1920px
- [ ] Verify smooth transitions at breakpoints:
  - 640px (sm) - Stat cards 1 → 2 columns
  - 768px (md) - Layout shifts
  - 1024px (lg) - Stat cards 2 → 4 columns
  - 1280px (xl) - Full desktop layout

---

### 9. Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Dropdowns accessible via keyboard
- [ ] Buttons activatable with Enter/Space

#### Screen Reader
- [ ] Test with NVDA/JAWS (Windows) or VoiceOver (Mac)
- [ ] Verify labels read correctly
- [ ] Check ARIA attributes present

#### Color Contrast
- [ ] Use browser extension (e.g., axe DevTools)
- [ ] Verify text meets WCAG AA standards
- [ ] Check disease colors are distinguishable

---

### 10. Browser Compatibility

#### Chrome
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

#### Firefox
- [ ] Feature parity with Chrome
- [ ] Performance acceptable
- [ ] Map renders correctly

#### Safari (if available)
- [ ] iOS Safari (mobile)
- [ ] macOS Safari (desktop)
- [ ] Check Flexbox/Grid layout

#### Edge
- [ ] Modern Edge (Chromium)
- [ ] Verify compatibility

---

## 🐛 Known Issues to Watch For

1. **Leaflet Map Initialization**
   - Sometimes requires refresh on first load
   - Error boundary should catch failures

2. **React Query DevTools**
   - May show stale data briefly during transitions
   - Normal behavior, not a bug

3. **Animation Performance**
   - Lower-end devices may see reduced FPS
   - Acceptable if above 30fps

4. **Network Errors**
   - Retry button may need 2-3 clicks if network unstable
   - Expected behavior with exponential backoff

---

## ✅ Success Criteria

**All tests pass when:**
- ✅ All 5 diseases load and display correctly
- ✅ All map controls function as expected
- ✅ Animations play smoothly without jank
- ✅ Error handling gracefully manages failures
- ✅ Responsive design works on all screen sizes
- ✅ State persists across page refreshes
- ✅ React Query caches data efficiently
- ✅ No console errors or warnings
- ✅ Performance stays above 30fps

---

## 📊 Test Report Template

After testing, document results:

```markdown
## Test Results - [Date]

### Summary
- Total Tests: X
- Passed: Y
- Failed: Z
- Skipped: W

### Issues Found
1. [Issue description]
   - **Severity**: Critical/High/Medium/Low
   - **Steps to Reproduce**: ...
   - **Expected**: ...
   - **Actual**: ...

### Performance Metrics
- Average FPS during animations: X fps
- Time to first render: X ms
- Bundle size: X MB

### Browser Compatibility
- Chrome: ✅/❌
- Firefox: ✅/❌
- Safari: ✅/❌
- Edge: ✅/❌

### Recommendations
- [Improvement suggestions]
```

---

## 🎯 Next Steps After Testing

1. **If all tests pass**: Mark Task #25 complete, proceed to Task #26
2. **If issues found**: Document in GitHub Issues, prioritize fixes
3. **Performance issues**: Profile with Chrome DevTools, optimize bottlenecks
4. **Accessibility issues**: Address WCAG violations, improve keyboard nav

Happy Testing! 🚀