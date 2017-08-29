import Ember from 'ember';
/**
 * The base for the provider moderation page (tabs, provider name, and breadcrumbs).
 *
 * Sample usage:
 * ```handlebars
 * {{moderation-base
 *    unread-count=10
 *    active='Settings'
 * }}
 * ```
 * @class moderation-base
 **/
export default Ember.Component.extend({
    theme: Ember.inject.service(),
    tabs: [
        { name: 'Moderation', route: 'provider.moderation'},
        { name: 'Settings', route: 'provider.settings'},
    ],
    breadCrumbs: Ember.computed('navigator.currentPath', function(){
        let crumbs = this.get('navigator.currentPath').split('.');
        crumbs.popObject();
        if(this.get('navigator.isIndexRoute')){
            crumbs.popObject(); //get rid of the index route at end
        }
        const breadedCrumbs = crumbs.map(function(crumb, index){
            const path = crumbs.slice(0, index + 1).join('.');
            return {
                path: path == '' ? 'index' : path,
                name: crumb
            }
        });
        return [{path: 'dashboard', name: 'Reviews Dashboard'}].concat(breadedCrumbs)
    }),
    actions: {
        toggleTab: function () {
            if (this.get('active') == 'Moderation'){
                this.set('active', 'Settings');
            } else {
                this.set('active', 'Moderation');
            }
        }
    }
});
