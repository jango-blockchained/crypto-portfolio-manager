Vue.component('Navigation', {
    props: {
    },
    template: `
<ul class="nav flex-column">
    <li class="nav-item">
        <a class="nav-link active" id="nav-overview-tab" data-toggle="tab" href="#nav-overview" role="tab" aria-controls="nav-overview" aria-selected="true" v-on:click="navigate(1)">
            <span data-feather="home"></span>Market Overview <span class="sr-only">(current)</span>
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link" id="nav-definition-tab" data-toggle="tab" href="#nav-definition" role="tab" aria-controls="nav-definition" aria-selected="false" v-on:click="navigate(2)">
            <span data-feather="shopping-bag"></span>Portfolio
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link" id="nav-analysis-tab" data-toggle="tab" href="#nav-analysis" role="tab" aria-controls="nav-analysis" aria-selected="false" v-on:click="navigate(3)">
            <span data-feather="eye"></span>Portfolio Analysis
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link" id="nav-performance-tab" data-toggle="tab" href="#nav-performance" role="tab" aria-controls="nav-performance" aria-selected="false" v-on:click="navigate(4)">
            <span data-feather="trending-up"></span>
            Performance Analysis
        </a>
    </li>
</ul>
    `,
    data() {
        return {
            // data goes here
        }
    },
    methods: {
        navigate: function (id) {
        // `this` inside methods points to the Vue instance
        app.currentPageName = app.pageNames[id];
        }
    },
    computed: {
        // computed properties go here
    } 
})

Vue.component('Infobox', {
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


Vue.component('Datatable', {
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

Vue.component('Performanceanalysis', {
    props: {
        id: {
        type: String
        }, 
    },
    template: `
<div>  
    <div class="row">  
        <div class="col-3">  
            <p>Status:</p>
        </div> 
        <div class="col-9">  
            <p id="status"></p>
        </div> 
    </div> 
    <div class="row">  
        <div class="col-3">  
            <p>Start date:</p>
        </div> 
        <div class="col-9">  
            <input id="startDate" type="date"> 
        </div> 
    </div> 
    <div class="row">  
        <div class="col-3">  
            <p>Number of coins</p>
        </div> 
        <div class="col-9">  
            <input id="numberOfCoins" type="number" value="1"> 
        </div> 
    </div> 
    <div class="row">  
        <div class="col-3">  
            <p>Normalize prices</p>
        </div> 
        <div class="col-9">  
            <input id="normalizePrices" type="checkbox" checked> 
        </div> 
    </div> 
    <div class="row">  
        <div class="col-3">  
        </div> 
        <div class="col-9">  
            <button id="updateChart" class="ml-3" type="button" >update</button>
        </div> 
    </div> 
    <canvas class="my-4 w-100" id="myChart"></canvas> 
</div> 
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

Vue.component('Modal', {
    props: {
        id: {
        type: String
        }, 
    },
    template: `
<div>  
    <div class="modal fade" id="modalAdd" tabindex="-1" role="dialog" aria-labelledby="modalAddTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalAddTitle">Add record</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" name="apply" data-toggle="modal" data-target="#modalAdd">Apply</button>
                </div>
            </div>
        </div>
    </div>
</div> 
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


/*
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
*/

