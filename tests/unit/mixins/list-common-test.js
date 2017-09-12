import Ember from 'ember';
import ListCommonMixin from 'reviews/mixins/list-common';
import { module, test } from 'qunit';

module('Unit | Mixin | list common');

// Replace this with your real tests.
test('it works', function(assert) {
  let ListCommonObject = Ember.Object.extend(ListCommonMixin);
  let subject = ListCommonObject.create();
  assert.ok(subject);
});
