import Ember from 'ember';
/**
 * The base for the provider moderation page (tabs, provider name, and breadcrumbs).
 *
 * Sample usage:
 * ```handlebars
 * {{moderation-base
 *    active='Settings'
 * }}
 * ```
 * @class moderation-base
 **/
export default Ember.Component.extend({
    i18n: Ember.inject.service(),
    theme: Ember.inject.service(),
    unreadCount: Ember.computed('theme', function () {
        return this.get('theme.provider.reviewableStatusCounts.pending');
    }),
    tabs: Ember.computed('i18n.locale', function(){
        const i18n = this.get('i18n');
        return [
            { id: 1, name: i18n.t('moderation_base.moderation_tab'), route: 'preprints.provider.moderation'},
            { id: 2, name: i18n.t('moderation_base.settings_tab'), route: 'preprints.provider.settings'},
        ];
    }),
    breadcrumbs: Ember.computed('navigator.currentPath', function(){
        // Always include the dashboard breadcrumb
        const breadcrumbs = [{
            name: this.get('i18n').t('dashboard.title'),
            path: 'index',
        }];
        for (const r of this.get('navigator.routeContexts')) {
            // Skip crumbs with no context
            if (Ember.isEmpty(r.context) || !Object.keys(r.context).length) continue;

            // Skip crumbs with the same context as the prior crumb
            if (r.context === breadcrumbs[breadcrumbs.length - 1].context) continue;

            // Prefer model name or title, fall back to the route name
            r.name = (r.context.get && (r.context.get('name') || r.context.get('title'))) || r.part;

            // Remove moderation or settings crumbs from the route
            if (r.name == 'moderation' || r.name == 'settings') continue;
            breadcrumbs.push(r);
        }
        return breadcrumbs;
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
