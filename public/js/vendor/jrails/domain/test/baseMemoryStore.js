define([], function() {

    describe("baseMemoryStore", function() {

        it("чтение пустого значения", function() {
            var store = container.instance(bundle.domain.baseMemoryStore);
            chai.assert.equal(store.get('var1'), null);
        });

        it("запись и чтение", function() {
            var store = container.instance(bundle.domain.baseMemoryStore);
            store.set('var1', 'val1');
            chai.assert.equal(store.get('var1'), 'val1');
        });

        it("запись, удаление и чтение", function() {
            var store = container.instance(bundle.domain.baseMemoryStore);
            store.set('var1', 'val1');
            store.remove('var1');
            chai.assert.equal(store.get('var1'), null);
        });

        it("fake", function() {
            //chai.assert.equal(2, 1);
        });

    });

});
