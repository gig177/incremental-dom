/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    ie_void = IncrementalDOM.ie_void;

describe('attribute updates', () => {
  var container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('for conditional attributes', () => {
    function render(obj) {
      ie_void('div', '', [],
              'data-expanded', obj.key);
    }

    it('should be present when they have a value', () => {
      patch(container, () => render({
        key: 'hello'
      }));
      var el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('hello');
    });

    it('should be present when falsy', () => {
      patch(container, () => render({
        key: false
      }));
      var el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('false');
    });

    it('should be not present when undefined', () => {
      patch(container, () => render({
        key: undefined
      }));
      var el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal(null);
    });

    it('should update the DOM when they change', () => {
      patch(container, () => render({
        key: 'foo'
      }));
      patch(container, () => render({
        key: 'bar'
      }));
      var el = container.childNodes[0];

      expect(el.getAttribute('data-expanded')).to.equal('bar');
    });
  });

  describe('for function attributes', () => {
    it('should not be set as attributes', () => {
      var fn = () =>{};
      patch(container, () => {
        ie_void('div', '', null,
                'fn', fn);
      });
      var el = container.childNodes[0];

      expect(el.hasAttribute('fn')).to.be.false;
    });

    it('should be set on the node', () => {
      var fn = () =>{};
      patch(container, () => {
        ie_void('div', '', null,
                'fn', fn);
      });
      var el = container.childNodes[0];

      expect(el.fn).to.equal(fn);
    });
  });

  describe('for object attributes', () => {
    it('should not be set as attributes', () => {
      var obj = {};
      patch(container, () => {
        ie_void('div', '', null,
                'obj', obj);
      });
      var el = container.childNodes[0];

      expect(el.hasAttribute('obj')).to.be.false;
    });

    it('should be set on the node', () => {
      var obj = {};
      patch(container, () => {
        ie_void('div', '', null,
                'obj', obj);
      });
      var el = container.childNodes[0];

      expect(el.obj).to.equal(obj);
    });
  });

  describe('for style', () => {
    function render(style) {
      ie_void('div', '', [],
              'style', style);
    }

    it('should render with the correct style properties for objects', () => {
      patch(container, () => render({
        color: 'white',
        backgroundColor: 'red'
      }));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('white');
      expect(el.style.backgroundColor).to.equal('red');
    });

    it('should update the correct style properties', () => {
      patch(container, () => render({
        color: 'white'
      }));
      patch(container, () => render({
        color: 'red'
      }));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('red');
    });

    it('should remove properties not present in the new object', () => {
      patch(container, () => render({
        color: 'white'
      }));
      patch(container, () => render({
        backgroundColor: 'red'
      }));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('');
      expect(el.style.backgroundColor).to.equal('red');
    });

    it('should render with the correct style properties for strings', () => {
      patch(container, () => render('color: white; background-color: red;'));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('white');
      expect(el.style.backgroundColor).to.equal('red');
    });

    it('should render with the correct style properties for String instances', () => {
      patch(container, () => render(new String('color: white; background-color: red;')));
      var el = container.childNodes[0];

      expect(el.style.color).to.equal('white');
      expect(el.style.backgroundColor).to.equal('red');
    });
  });
});

