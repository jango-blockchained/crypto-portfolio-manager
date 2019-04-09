Vue.component('infobox', {
    props: {
        id: {
            type: String,
            required: true,
            default: 'n/a'
        }, 
        name: {
            type: String,
            required: true,
            default: 'n/a'
        }, 
        value: {
            type: String,
            required: true,
            default: 'n/a'
        }, 
    },
    template: `   
<ul class="list-group">
    <li class="list-group-item d-flex justify-content-between align-items-center">
        {{name}}
        <span :id="id" class="badge badge-primary badge-pill">{{value}}</span>
    </li>
</ul>
    `,
    data() {
        return {
            // data goes here
        }
    },
    methods: {
        // methods go here
    },
    computed: {
        // computed properties go here
    } 
})

Vue.component('vnav', {
    props: {
    },
    template: `
<nav>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a class="nav-item nav-link active" id="nav-overview-tab" data-toggle="tab" href="#nav-overview" role="tab" aria-controls="nav-overview" aria-selected="true">Market Overview</a>
        <a class="nav-item nav-link" id="nav-definition-tab" data-toggle="tab" href="#nav-definition" role="tab" aria-controls="nav-definition" aria-selected="false">Portfolio</a>
        <a class="nav-item nav-link" id="nav-analysis-tab" data-toggle="tab" href="#nav-analysis" role="tab" aria-controls="nav-analysis" aria-selected="false">Portfolio Analysis</a>
        <a class="nav-item nav-link" id="nav-performance-tab" data-toggle="tab" href="#nav-performance" role="tab" aria-controls="nav-performance" aria-selected="false">Performance Analysis</a>
    </div>
</nav>
    `,
    data() {
        return {
            // data goes here
        }
    },
    methods: {
        // methods go here
    },
    computed: {
        // computed properties go here
    } 
})

Vue.component('vdatatable', {
    props: {
        id: {
        type: String,
        required: true
        }, 
    },
    template: `
<table :id="id" class="table table-striped table-bordered" cellspacing="0" width="100%">
</table>   
    `,
    data() {
        return {
            // data goes here
        }
    },
    methods: {
        // methods go here
    },
    computed: {
        // computed properties go here
    } 
})

