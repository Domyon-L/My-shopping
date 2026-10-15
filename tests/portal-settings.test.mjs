import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from './helpers.mjs';

function setDuration(b,seconds){
  const slider=b.$('#portalDuration');slider.value=String(seconds);
  slider.dispatchEvent(new b.w.Event('input',{bubbles:true}));
}

test('duration slider enters at 0.5, 1.8 and 3 seconds with matching progress timing',()=>{
  for(const [width,seconds]of [[320,.5],[390,1.8],[1440,3]]){
    const b=boot({}, {entry:true,width,reduce:true});try{
      const {$,click,advance}=b,slider=$('#portalDuration');
      assert.equal(slider.min,'0.5');assert.equal(slider.max,'3');assert.equal(slider.step,'0.1');
      assert.equal(slider.labels[0].textContent.trim(),'进入时长 1.5 秒');
      setDuration(b,seconds);assert.equal($('#portalDurationValue').value,seconds.toFixed(1)+' 秒');
      assert.equal(slider.getAttribute('aria-valuetext'),seconds.toFixed(1)+' 秒');
      click('#entryBrowse');const ms=seconds*1000;
      assert.equal($('#portalDialog').style.getPropertyValue('--portal-duration'),ms+'ms');
      assert.equal($('#portalDialog').style.getPropertyValue('--portal-arrival-delay'),Math.round(ms*.84)+'ms');
      assert.equal($('#portalDialog').style.getPropertyValue('--portal-arrival-duration'),Math.round(ms*.16)+'ms');
      advance(ms-1);assert($('#portalDialog').open);assert($('#storefront').hidden);
      advance(1);assert(!$('#portalDialog').open);assert(!$('#storefront').hidden);assert($('#petWrap').hidden);
      assert.deepEqual(b.errors,[]);
    }finally{b.dom.window.close();}
  }
});

test('duration persists across reloads and each passage retains its starting duration',()=>{
  const b=boot({}, {entry:true,reduce:true,asyncClose:true});let saved;try{
    setDuration(b,1.8);b.click('#enterCity');setDuration(b,3);
    assert.equal(b.$('#portalDialog').style.getPropertyValue('--portal-duration'),'1800ms');
    b.advance(1799);assert(b.$('#storefront').hidden);b.advance(1);b.advance(10);
    b.click('#backToEntry');assert.equal(b.$('#portalDuration').value,'3');
    b.click('#entryBrowse');b.advance(2999);assert(b.$('#storefront').hidden);b.advance(1);assert(!b.$('#storefront').hidden);
    saved=b.w.localStorage.getItem('domyon-portal-duration');assert.equal(saved,'3000');assert.deepEqual(b.errors,[]);
  }finally{b.dom.window.close();}
  const again=boot({'domyon-portal-duration':saved},{entry:true,reduce:true});try{
    assert.equal(again.$('#portalDuration').value,'3');again.click('#entryBrowse');again.advance(2999);assert(again.$('#storefront').hidden);again.advance(1);assert(!again.$('#storefront').hidden);assert.deepEqual(again.errors,[]);
  }finally{again.dom.window.close();}
});

test('corrupted duration preferences fall back while numeric preferences stay within the allowed range',()=>{
  for(const [saved,expected]of [['not-json',1500],['"3000"',1500],['null',1500],['{}',1500],['-100',500],['9000',3000],['1749',1700]]){
    const b=boot({'domyon-portal-duration':saved},{entry:true,reduce:true});try{
      assert.equal(Number(b.$('#portalDuration').value)*1000,expected);
      b.click('#entryBrowse');b.advance(expected-1);assert(b.$('#storefront').hidden);b.advance(1);assert(!b.$('#storefront').hidden);assert.deepEqual(b.errors,[]);
    }finally{b.dom.window.close();}
  }
});

test('slow passages cancel safely and skipping never triggers a second entry',()=>{
  const b=boot({}, {entry:true,reduce:true,asyncClose:true});try{
    let entries=0;b.w.document.addEventListener('city:enter',()=>entries++);setDuration(b,3);
    b.click('#entryBrowse');b.advance(2400);b.click('#portalCancel');b.advance(1000);
    assert.equal(entries,0);assert(b.$('#storefront').hidden);assert(!b.$('#entryScreen').hidden);
    b.click('#entryBrowse');b.advance(400);b.click('#portalSkip');b.advance(5000);
    assert.equal(entries,1);assert(!b.$('#storefront').hidden);assert(!b.$('#portalDialog').open);assert.deepEqual(b.errors,[]);
  }finally{b.dom.window.close();}
});

test('star fields and distant sky draw at phone and desktop sizes without invalid geometry or lingering passage frames',()=>{
  for(const [width,height,seconds]of [[320,568,.5],[390,844,3],[1440,900,1.8]]){
    const b=boot({}, {entry:true,width,height});try{
      setDuration(b,seconds);b.click('#entryBrowse');
      assert.equal(b.frames.size,1,'The entrance stops drawing behind the full-screen passage');
      for(const [id,fn]of [...b.frames]){b.frames.delete(id);fn(seconds*500);}
      assert.equal(b.drawing.plates,1,'The passage uses the cached distant sky');
      assert(b.drawing.linearGradients<10,'No aurora curtain gradients should be drawn');assert(b.drawing.arc>100,'The scene still draws stars');assert.equal(b.drawing.invalid,0);
      const count=b.drawing.paths;b.click('#portalCancel');
      assert.equal(b.frames.size,1,'Cancellation restores only the entrance animation');
      for(const [id,fn]of [...b.frames]){b.frames.delete(id);fn(seconds*800);}
      assert.equal(b.drawing.paths,count);assert.deepEqual(b.errors,[]);
    }finally{b.dom.window.close();}
  }
});
