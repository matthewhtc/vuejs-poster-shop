
var PRICE = 9.99; // "constant"
var LOAD_NUM = 10; 

new Vue ({ 
    el: '#app', 
    data: {
        total: 0, 
        items: [], 
        cart: [],
        results: [], 
        newSearch: 'anime', 
        lastSearch: '', 
        loading: false, 
        price: PRICE, 
    },
    methods: {
        appendItems: function() {
            console.log('appendItems'); 
            // check if anything is left in items
            if (this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM); 
                this.items = this.items.concat(append); 
            }
            // if so, add it to the page
        },
        onSubmit: function() {
            if (this.newSearch.length) {
                this.items = []; 
                this.loading = true; 
    
                this.$http
                    .get('/search/'.concat(this.newSearch))
                    .then(function(res) { // returns a promise
                        // console.log(res); 
                        this.lastSearch = this.newSearch; 
                        this.results = res.data; 
                        this.appendItems(); 
                        this.loading = false; 
                    })
                ; 
            }
        },
        addItem: function(index) { // pass item's index, and put that item into the cart. 
            this.total += PRICE; 
            // console.log(this.cart); 
            var item = this.items[index]; 
            var found = false; 
            // put item in the cart 
            // check if item is in cart (iterate thru); if it is, don't add it again; just inc/dec
            for (var i = 0; i < this.cart.length; i++) {
                
                if (this.cart[i].id === item.id) {
                    found = true; 
                    this.cart[i].qty++; 
                    break; 
                } 
            }
            if (!found) {
                console.log(item); 
                this.cart.push({
                    id: item.id,
                    title: item.title, 
                    qty: 1, 
                    price: PRICE
                });    
            }   
        }, 
        inc: function(item) {
            item.qty++; 
            this.total += PRICE; 
        }, 
        dec: function(item) {
            item.qty--;  
            this.total -= PRICE; 

            // cannot have negative items in cart
            if (item.qty <= 0) {
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1); // position where to splice, # items you want to delete
                        break; 
                    }
                }
            }
        }
    }, 
    filters: {
        currency: function(price) { // always need an arg b/c smt is getting 'piped' into it
            return '$'.concat(price.toFixed(2)); 
        }
    }, 
    computed: {
        noMoreItems: function() {
            return this.items.length === this.results.length && this.results.length > 0; 
        }
    },
    mounted: function() { // will be called when app is mounted into the DOM 
        this.onSubmit(); 

        var vueInstance = this; 

        // we want to set this up right when Vue mounts the app!
        var elem = document.getElementById('product-list-bottom'); 
        var watcher = scrollMonitor.create(elem); // watcher triggers certain events upon entering/exiting viewport
        watcher.enterViewport(function() {
            vueInstance.appendItems(); 
        }); 

    }
}); 



