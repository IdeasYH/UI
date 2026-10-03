import assert from 'node:assert/strict'
import test from 'node:test'
import { hexToHsl, hslToHex, colorStripStops, stripColor, stripPosition } from '../src/components/ui/color-model.ts'

test('单行色带从白到黑、经过所有色节点并连续插值', () => {
  for (const [index, color] of colorStripStops.entries()) assert.equal(stripColor(index * 10), color)
  assert.equal(stripColor(-1), '#FFFFFF')
  assert.equal(stripColor(101), '#000000')
  for (const position of [3, 15, 26, 42, 67, 83, 97]) {
    assert.ok(Math.abs(stripPosition(stripColor(position)) - position) < .1)
  }
})
test('完整色相覆盖红黄绿青蓝紫及循环端点', () => {
  assert.deepEqual([0, 60, 120, 180, 240, 300, 360].map(h => hslToHex({ h, s: 100, l: 50 })), ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF0000'])
})
test('黑白灰与标准色往返保持一致', () => {
  for (const color of ['#000000', '#FFFFFF', '#808080', '#FACC15', '#FF6B81', '#0D9488']) assert.equal(hslToHex(hexToHsl(color)), color)
  assert.equal(hslToHex({ h: 120, s: 0, l: 50 }), '#808080')
})
