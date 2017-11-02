import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('action-feed-entry', 'Integration | Component | action-feed-entry', {
    integration: true,
});


test('it renders action-feed-entry', function(assert) {
    this.set('action', EmberObject.create({
        dateCreated: '2017-10-28T14:57:35.949534Z',
        creator: { fullName: 'Po' },
        provider: { name: 'viperXiv', preprintWord: 'preprint' },
        actionTrigger: 'submit',
        target: { title: 'the archive of all vipers' },
    }));
    this.set('toDetail', () => {});
    this.render(hbs`{{action-feed-entry action=action toDetail=toDetail}}`);
    assert.ok(this.$('.entry-body').length);
    assert.equal(this.$('.entry-body').text().replace(/\s+/g, ' ').trim(), 'October 28, 2017 Po submitted a preprint to viperXiv the archive of all vipers');
});
