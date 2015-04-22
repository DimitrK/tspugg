describe('app.core.Module', function () {
    it('Name space allocated', function () {
        expect(app.core.Module).toBeDefined();
    });

    describe('#extend()', function () {

        it('is defined', function () {
            expect(app.core.Module.extend).toBeDefined();
        });

        it('throws when a something other than object is passed', function () {
            expect(app.core.Module.extend.bind(app.core.Module, undefined)).toThrow();
            expect(app.core.Module.extend.bind(app.core.Module, null)).toThrow();
            expect(app.core.Module.extend.bind(app.core.Module, '')).toThrow();
            expect(app.core.Module.extend.bind(app.core.Module, 'string')).toThrow();
            expect(app.core.Module.extend.bind(app.core.Module, [])).toThrow();
            expect(app.core.Module.extend.bind(app.core.Module, [1, 2, 3])).toThrow();
            expect(app.core.Module.extend.bind(app.core.Module, 0)).toThrow();
            expect(app.core.Module.extend.bind(app.core.Module, 11)).toThrow();
            expect(app.core.Module.extend.bind(app.core.Module, true)).toThrow();
            expect(app.core.Module.extend.bind(app.core.Module, false)).toThrow();
        });

        it('returns a function', function () {
            var SubModule = app.core.Module.extend({});
            expect(SubModule).toBeDefined();
            expect(Object.prototype.toString.call(SubModule)).toBe('[object Function]');
        });

        it('the return function has method extend', function () {
            var SubModule = app.core.Module.extend({});
            expect(SubModule.extend).toBeDefined();
            expect(Object.prototype.toString.call(SubModule.extend)).toBe('[object Function]');
        });

    });

    describe('#construct()', function () {

        it('should be called upon a new submodule instance creation', function () {
            var SubModule = app.core.Module.extend({});
            spyOn(app.core.Module.prototype, 'construct').and.callThrough();

            var submodule = new SubModule();
            expect(submodule.construct).toHaveBeenCalled();
        });
    });

    describe('#super()', function () {

        it('should call super methods through all the prototype chain', function () {
            var SubModule = app.core.Module.extend({
                foo: 1,
                bar: function () {
                    return 'Sub-' + this.foo;
                }
            });
            var SubSubModule = SubModule.extend({
                foo: 2,
                bar: function () {
                    return 'Sub-Sub-' + this.foo + '-' + this.super();
                }
            });
            var SubSubSubModule = SubSubModule.extend({
                foo: 3,
                bar: function () {
                    return 'Sub-Sub-Sub-' + this.foo + '-' + this.super();
                }
            });

            spyOn(app.core.Module.prototype, 'construct').and.callThrough();

            var subsubsubmodule = new SubSubSubModule();
            var expected = 'Sub-Sub-Sub-3-Sub-Sub-3-Sub-3';
            expect(subsubsubmodule.bar()).toBe(expected);
        });

        it('should throw if such super method does not exist through all of the prototype chain', function () {
            var SubModule = app.core.Module.extend({
                foo: function () {
                    return this.super();
                }
            });
            var SubSubModule = SubModule.extend({
                bar: function () {
                    return this.super();
                }
            });
            var submodule = new SubModule();
            var subsubmodule = new SubSubModule();
            expect(submodule.foo.bind(submodule)).toThrow();
            expect(subsubmodule.bar.bind(subsubmodule)).toThrow();
        });

        it('should not throw if such super method exists but not on the immediate super module', function () {
            var SubModule = app.core.Module.extend({
                foo: function () {
                    return 1;
                }
            });
            var SubSubModule = SubModule.extend({

            });
            var SubSubSubModule = SubSubModule.extend({
                foo: function () {
                    return this.super();
                }
            });

            var subsubsubmodule = new SubSubSubModule();
            expect(subsubsubmodule.foo.bind(subsubsubmodule)).not.toThrow();
            expect(subsubsubmodule.foo()).toBe(1);
        });
    });
});