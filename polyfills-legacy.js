(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var runtime = {exports: {}};

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var hasRequiredRuntime;

	function requireRuntime () {
		if (hasRequiredRuntime) return runtime.exports;
		hasRequiredRuntime = 1;
		(function (module) {
			var runtime = (function (exports) {

			  var Op = Object.prototype;
			  var hasOwn = Op.hasOwnProperty;
			  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
			  var undefined$1; // More compressible than void 0.
			  var $Symbol = typeof Symbol === "function" ? Symbol : {};
			  var iteratorSymbol = $Symbol.iterator || "@@iterator";
			  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
			  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

			  function define(obj, key, value) {
			    Object.defineProperty(obj, key, {
			      value: value,
			      enumerable: true,
			      configurable: true,
			      writable: true
			    });
			    return obj[key];
			  }
			  try {
			    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
			    define({}, "");
			  } catch (err) {
			    define = function(obj, key, value) {
			      return obj[key] = value;
			    };
			  }

			  function wrap(innerFn, outerFn, self, tryLocsList) {
			    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
			    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
			    var generator = Object.create(protoGenerator.prototype);
			    var context = new Context(tryLocsList || []);

			    // The ._invoke method unifies the implementations of the .next,
			    // .throw, and .return methods.
			    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

			    return generator;
			  }
			  exports.wrap = wrap;

			  // Try/catch helper to minimize deoptimizations. Returns a completion
			  // record like context.tryEntries[i].completion. This interface could
			  // have been (and was previously) designed to take a closure to be
			  // invoked without arguments, but in all the cases we care about we
			  // already have an existing method we want to call, so there's no need
			  // to create a new function object. We can even get away with assuming
			  // the method takes exactly one argument, since that happens to be true
			  // in every case, so we don't have to touch the arguments object. The
			  // only additional allocation required is the completion record, which
			  // has a stable shape and so hopefully should be cheap to allocate.
			  function tryCatch(fn, obj, arg) {
			    try {
			      return { type: "normal", arg: fn.call(obj, arg) };
			    } catch (err) {
			      return { type: "throw", arg: err };
			    }
			  }

			  var GenStateSuspendedStart = "suspendedStart";
			  var GenStateSuspendedYield = "suspendedYield";
			  var GenStateExecuting = "executing";
			  var GenStateCompleted = "completed";

			  // Returning this object from the innerFn has the same effect as
			  // breaking out of the dispatch switch statement.
			  var ContinueSentinel = {};

			  // Dummy constructor functions that we use as the .constructor and
			  // .constructor.prototype properties for functions that return Generator
			  // objects. For full spec compliance, you may wish to configure your
			  // minifier not to mangle the names of these two functions.
			  function Generator() {}
			  function GeneratorFunction() {}
			  function GeneratorFunctionPrototype() {}

			  // This is a polyfill for %IteratorPrototype% for environments that
			  // don't natively support it.
			  var IteratorPrototype = {};
			  define(IteratorPrototype, iteratorSymbol, function () {
			    return this;
			  });

			  var getProto = Object.getPrototypeOf;
			  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
			  if (NativeIteratorPrototype &&
			      NativeIteratorPrototype !== Op &&
			      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
			    // This environment has a native %IteratorPrototype%; use it instead
			    // of the polyfill.
			    IteratorPrototype = NativeIteratorPrototype;
			  }

			  var Gp = GeneratorFunctionPrototype.prototype =
			    Generator.prototype = Object.create(IteratorPrototype);
			  GeneratorFunction.prototype = GeneratorFunctionPrototype;
			  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
			  defineProperty(
			    GeneratorFunctionPrototype,
			    "constructor",
			    { value: GeneratorFunction, configurable: true }
			  );
			  GeneratorFunction.displayName = define(
			    GeneratorFunctionPrototype,
			    toStringTagSymbol,
			    "GeneratorFunction"
			  );

			  // Helper for defining the .next, .throw, and .return methods of the
			  // Iterator interface in terms of a single ._invoke method.
			  function defineIteratorMethods(prototype) {
			    ["next", "throw", "return"].forEach(function(method) {
			      define(prototype, method, function(arg) {
			        return this._invoke(method, arg);
			      });
			    });
			  }

			  exports.isGeneratorFunction = function(genFun) {
			    var ctor = typeof genFun === "function" && genFun.constructor;
			    return ctor
			      ? ctor === GeneratorFunction ||
			        // For the native GeneratorFunction constructor, the best we can
			        // do is to check its .name property.
			        (ctor.displayName || ctor.name) === "GeneratorFunction"
			      : false;
			  };

			  exports.mark = function(genFun) {
			    if (Object.setPrototypeOf) {
			      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
			    } else {
			      genFun.__proto__ = GeneratorFunctionPrototype;
			      define(genFun, toStringTagSymbol, "GeneratorFunction");
			    }
			    genFun.prototype = Object.create(Gp);
			    return genFun;
			  };

			  // Within the body of any async function, `await x` is transformed to
			  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
			  // `hasOwn.call(value, "__await")` to determine if the yielded value is
			  // meant to be awaited.
			  exports.awrap = function(arg) {
			    return { __await: arg };
			  };

			  function AsyncIterator(generator, PromiseImpl) {
			    function invoke(method, arg, resolve, reject) {
			      var record = tryCatch(generator[method], generator, arg);
			      if (record.type === "throw") {
			        reject(record.arg);
			      } else {
			        var result = record.arg;
			        var value = result.value;
			        if (value &&
			            typeof value === "object" &&
			            hasOwn.call(value, "__await")) {
			          return PromiseImpl.resolve(value.__await).then(function(value) {
			            invoke("next", value, resolve, reject);
			          }, function(err) {
			            invoke("throw", err, resolve, reject);
			          });
			        }

			        return PromiseImpl.resolve(value).then(function(unwrapped) {
			          // When a yielded Promise is resolved, its final value becomes
			          // the .value of the Promise<{value,done}> result for the
			          // current iteration.
			          result.value = unwrapped;
			          resolve(result);
			        }, function(error) {
			          // If a rejected Promise was yielded, throw the rejection back
			          // into the async generator function so it can be handled there.
			          return invoke("throw", error, resolve, reject);
			        });
			      }
			    }

			    var previousPromise;

			    function enqueue(method, arg) {
			      function callInvokeWithMethodAndArg() {
			        return new PromiseImpl(function(resolve, reject) {
			          invoke(method, arg, resolve, reject);
			        });
			      }

			      return previousPromise =
			        // If enqueue has been called before, then we want to wait until
			        // all previous Promises have been resolved before calling invoke,
			        // so that results are always delivered in the correct order. If
			        // enqueue has not been called before, then it is important to
			        // call invoke immediately, without waiting on a callback to fire,
			        // so that the async generator function has the opportunity to do
			        // any necessary setup in a predictable way. This predictability
			        // is why the Promise constructor synchronously invokes its
			        // executor callback, and why async functions synchronously
			        // execute code before the first await. Since we implement simple
			        // async functions in terms of async generators, it is especially
			        // important to get this right, even though it requires care.
			        previousPromise ? previousPromise.then(
			          callInvokeWithMethodAndArg,
			          // Avoid propagating failures to Promises returned by later
			          // invocations of the iterator.
			          callInvokeWithMethodAndArg
			        ) : callInvokeWithMethodAndArg();
			    }

			    // Define the unified helper method that is used to implement .next,
			    // .throw, and .return (see defineIteratorMethods).
			    defineProperty(this, "_invoke", { value: enqueue });
			  }

			  defineIteratorMethods(AsyncIterator.prototype);
			  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
			    return this;
			  });
			  exports.AsyncIterator = AsyncIterator;

			  // Note that simple async functions are implemented on top of
			  // AsyncIterator objects; they just return a Promise for the value of
			  // the final result produced by the iterator.
			  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
			    if (PromiseImpl === void 0) PromiseImpl = Promise;

			    var iter = new AsyncIterator(
			      wrap(innerFn, outerFn, self, tryLocsList),
			      PromiseImpl
			    );

			    return exports.isGeneratorFunction(outerFn)
			      ? iter // If outerFn is a generator, return the full iterator.
			      : iter.next().then(function(result) {
			          return result.done ? result.value : iter.next();
			        });
			  };

			  function makeInvokeMethod(innerFn, self, context) {
			    var state = GenStateSuspendedStart;

			    return function invoke(method, arg) {
			      if (state === GenStateExecuting) {
			        throw new Error("Generator is already running");
			      }

			      if (state === GenStateCompleted) {
			        if (method === "throw") {
			          throw arg;
			        }

			        // Be forgiving, per GeneratorResume behavior specified since ES2015:
			        // ES2015 spec, step 3: https://262.ecma-international.org/6.0/#sec-generatorresume
			        // Latest spec, step 2: https://tc39.es/ecma262/#sec-generatorresume
			        return doneResult();
			      }

			      context.method = method;
			      context.arg = arg;

			      while (true) {
			        var delegate = context.delegate;
			        if (delegate) {
			          var delegateResult = maybeInvokeDelegate(delegate, context);
			          if (delegateResult) {
			            if (delegateResult === ContinueSentinel) continue;
			            return delegateResult;
			          }
			        }

			        if (context.method === "next") {
			          // Setting context._sent for legacy support of Babel's
			          // function.sent implementation.
			          context.sent = context._sent = context.arg;

			        } else if (context.method === "throw") {
			          if (state === GenStateSuspendedStart) {
			            state = GenStateCompleted;
			            throw context.arg;
			          }

			          context.dispatchException(context.arg);

			        } else if (context.method === "return") {
			          context.abrupt("return", context.arg);
			        }

			        state = GenStateExecuting;

			        var record = tryCatch(innerFn, self, context);
			        if (record.type === "normal") {
			          // If an exception is thrown from innerFn, we leave state ===
			          // GenStateExecuting and loop back for another invocation.
			          state = context.done
			            ? GenStateCompleted
			            : GenStateSuspendedYield;

			          if (record.arg === ContinueSentinel) {
			            continue;
			          }

			          return {
			            value: record.arg,
			            done: context.done
			          };

			        } else if (record.type === "throw") {
			          state = GenStateCompleted;
			          // Dispatch the exception by looping back around to the
			          // context.dispatchException(context.arg) call above.
			          context.method = "throw";
			          context.arg = record.arg;
			        }
			      }
			    };
			  }

			  // Call delegate.iterator[context.method](context.arg) and handle the
			  // result, either by returning a { value, done } result from the
			  // delegate iterator, or by modifying context.method and context.arg,
			  // setting context.delegate to null, and returning the ContinueSentinel.
			  function maybeInvokeDelegate(delegate, context) {
			    var methodName = context.method;
			    var method = delegate.iterator[methodName];
			    if (method === undefined$1) {
			      // A .throw or .return when the delegate iterator has no .throw
			      // method, or a missing .next method, always terminate the
			      // yield* loop.
			      context.delegate = null;

			      // Note: ["return"] must be used for ES3 parsing compatibility.
			      if (methodName === "throw" && delegate.iterator["return"]) {
			        // If the delegate iterator has a return method, give it a
			        // chance to clean up.
			        context.method = "return";
			        context.arg = undefined$1;
			        maybeInvokeDelegate(delegate, context);

			        if (context.method === "throw") {
			          // If maybeInvokeDelegate(context) changed context.method from
			          // "return" to "throw", let that override the TypeError below.
			          return ContinueSentinel;
			        }
			      }
			      if (methodName !== "return") {
			        context.method = "throw";
			        context.arg = new TypeError(
			          "The iterator does not provide a '" + methodName + "' method");
			      }

			      return ContinueSentinel;
			    }

			    var record = tryCatch(method, delegate.iterator, context.arg);

			    if (record.type === "throw") {
			      context.method = "throw";
			      context.arg = record.arg;
			      context.delegate = null;
			      return ContinueSentinel;
			    }

			    var info = record.arg;

			    if (! info) {
			      context.method = "throw";
			      context.arg = new TypeError("iterator result is not an object");
			      context.delegate = null;
			      return ContinueSentinel;
			    }

			    if (info.done) {
			      // Assign the result of the finished delegate to the temporary
			      // variable specified by delegate.resultName (see delegateYield).
			      context[delegate.resultName] = info.value;

			      // Resume execution at the desired location (see delegateYield).
			      context.next = delegate.nextLoc;

			      // If context.method was "throw" but the delegate handled the
			      // exception, let the outer generator proceed normally. If
			      // context.method was "next", forget context.arg since it has been
			      // "consumed" by the delegate iterator. If context.method was
			      // "return", allow the original .return call to continue in the
			      // outer generator.
			      if (context.method !== "return") {
			        context.method = "next";
			        context.arg = undefined$1;
			      }

			    } else {
			      // Re-yield the result returned by the delegate method.
			      return info;
			    }

			    // The delegate iterator is finished, so forget it and continue with
			    // the outer generator.
			    context.delegate = null;
			    return ContinueSentinel;
			  }

			  // Define Generator.prototype.{next,throw,return} in terms of the
			  // unified ._invoke helper method.
			  defineIteratorMethods(Gp);

			  define(Gp, toStringTagSymbol, "Generator");

			  // A Generator should always return itself as the iterator object when the
			  // @@iterator function is called on it. Some browsers' implementations of the
			  // iterator prototype chain incorrectly implement this, causing the Generator
			  // object to not be returned from this call. This ensures that doesn't happen.
			  // See https://github.com/facebook/regenerator/issues/274 for more details.
			  define(Gp, iteratorSymbol, function() {
			    return this;
			  });

			  define(Gp, "toString", function() {
			    return "[object Generator]";
			  });

			  function pushTryEntry(locs) {
			    var entry = { tryLoc: locs[0] };

			    if (1 in locs) {
			      entry.catchLoc = locs[1];
			    }

			    if (2 in locs) {
			      entry.finallyLoc = locs[2];
			      entry.afterLoc = locs[3];
			    }

			    this.tryEntries.push(entry);
			  }

			  function resetTryEntry(entry) {
			    var record = entry.completion || {};
			    record.type = "normal";
			    delete record.arg;
			    entry.completion = record;
			  }

			  function Context(tryLocsList) {
			    // The root entry object (effectively a try statement without a catch
			    // or a finally block) gives us a place to store values thrown from
			    // locations where there is no enclosing try statement.
			    this.tryEntries = [{ tryLoc: "root" }];
			    tryLocsList.forEach(pushTryEntry, this);
			    this.reset(true);
			  }

			  exports.keys = function(val) {
			    var object = Object(val);
			    var keys = [];
			    for (var key in object) {
			      keys.push(key);
			    }
			    keys.reverse();

			    // Rather than returning an object with a next method, we keep
			    // things simple and return the next function itself.
			    return function next() {
			      while (keys.length) {
			        var key = keys.pop();
			        if (key in object) {
			          next.value = key;
			          next.done = false;
			          return next;
			        }
			      }

			      // To avoid creating an additional object, we just hang the .value
			      // and .done properties off the next function object itself. This
			      // also ensures that the minifier will not anonymize the function.
			      next.done = true;
			      return next;
			    };
			  };

			  function values(iterable) {
			    if (iterable != null) {
			      var iteratorMethod = iterable[iteratorSymbol];
			      if (iteratorMethod) {
			        return iteratorMethod.call(iterable);
			      }

			      if (typeof iterable.next === "function") {
			        return iterable;
			      }

			      if (!isNaN(iterable.length)) {
			        var i = -1, next = function next() {
			          while (++i < iterable.length) {
			            if (hasOwn.call(iterable, i)) {
			              next.value = iterable[i];
			              next.done = false;
			              return next;
			            }
			          }

			          next.value = undefined$1;
			          next.done = true;

			          return next;
			        };

			        return next.next = next;
			      }
			    }

			    throw new TypeError(typeof iterable + " is not iterable");
			  }
			  exports.values = values;

			  function doneResult() {
			    return { value: undefined$1, done: true };
			  }

			  Context.prototype = {
			    constructor: Context,

			    reset: function(skipTempReset) {
			      this.prev = 0;
			      this.next = 0;
			      // Resetting context._sent for legacy support of Babel's
			      // function.sent implementation.
			      this.sent = this._sent = undefined$1;
			      this.done = false;
			      this.delegate = null;

			      this.method = "next";
			      this.arg = undefined$1;

			      this.tryEntries.forEach(resetTryEntry);

			      if (!skipTempReset) {
			        for (var name in this) {
			          // Not sure about the optimal order of these conditions:
			          if (name.charAt(0) === "t" &&
			              hasOwn.call(this, name) &&
			              !isNaN(+name.slice(1))) {
			            this[name] = undefined$1;
			          }
			        }
			      }
			    },

			    stop: function() {
			      this.done = true;

			      var rootEntry = this.tryEntries[0];
			      var rootRecord = rootEntry.completion;
			      if (rootRecord.type === "throw") {
			        throw rootRecord.arg;
			      }

			      return this.rval;
			    },

			    dispatchException: function(exception) {
			      if (this.done) {
			        throw exception;
			      }

			      var context = this;
			      function handle(loc, caught) {
			        record.type = "throw";
			        record.arg = exception;
			        context.next = loc;

			        if (caught) {
			          // If the dispatched exception was caught by a catch block,
			          // then let that catch block handle the exception normally.
			          context.method = "next";
			          context.arg = undefined$1;
			        }

			        return !! caught;
			      }

			      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
			        var entry = this.tryEntries[i];
			        var record = entry.completion;

			        if (entry.tryLoc === "root") {
			          // Exception thrown outside of any try block that could handle
			          // it, so set the completion value of the entire function to
			          // throw the exception.
			          return handle("end");
			        }

			        if (entry.tryLoc <= this.prev) {
			          var hasCatch = hasOwn.call(entry, "catchLoc");
			          var hasFinally = hasOwn.call(entry, "finallyLoc");

			          if (hasCatch && hasFinally) {
			            if (this.prev < entry.catchLoc) {
			              return handle(entry.catchLoc, true);
			            } else if (this.prev < entry.finallyLoc) {
			              return handle(entry.finallyLoc);
			            }

			          } else if (hasCatch) {
			            if (this.prev < entry.catchLoc) {
			              return handle(entry.catchLoc, true);
			            }

			          } else if (hasFinally) {
			            if (this.prev < entry.finallyLoc) {
			              return handle(entry.finallyLoc);
			            }

			          } else {
			            throw new Error("try statement without catch or finally");
			          }
			        }
			      }
			    },

			    abrupt: function(type, arg) {
			      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
			        var entry = this.tryEntries[i];
			        if (entry.tryLoc <= this.prev &&
			            hasOwn.call(entry, "finallyLoc") &&
			            this.prev < entry.finallyLoc) {
			          var finallyEntry = entry;
			          break;
			        }
			      }

			      if (finallyEntry &&
			          (type === "break" ||
			           type === "continue") &&
			          finallyEntry.tryLoc <= arg &&
			          arg <= finallyEntry.finallyLoc) {
			        // Ignore the finally entry if control is not jumping to a
			        // location outside the try/catch block.
			        finallyEntry = null;
			      }

			      var record = finallyEntry ? finallyEntry.completion : {};
			      record.type = type;
			      record.arg = arg;

			      if (finallyEntry) {
			        this.method = "next";
			        this.next = finallyEntry.finallyLoc;
			        return ContinueSentinel;
			      }

			      return this.complete(record);
			    },

			    complete: function(record, afterLoc) {
			      if (record.type === "throw") {
			        throw record.arg;
			      }

			      if (record.type === "break" ||
			          record.type === "continue") {
			        this.next = record.arg;
			      } else if (record.type === "return") {
			        this.rval = this.arg = record.arg;
			        this.method = "return";
			        this.next = "end";
			      } else if (record.type === "normal" && afterLoc) {
			        this.next = afterLoc;
			      }

			      return ContinueSentinel;
			    },

			    finish: function(finallyLoc) {
			      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
			        var entry = this.tryEntries[i];
			        if (entry.finallyLoc === finallyLoc) {
			          this.complete(entry.completion, entry.afterLoc);
			          resetTryEntry(entry);
			          return ContinueSentinel;
			        }
			      }
			    },

			    "catch": function(tryLoc) {
			      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
			        var entry = this.tryEntries[i];
			        if (entry.tryLoc === tryLoc) {
			          var record = entry.completion;
			          if (record.type === "throw") {
			            var thrown = record.arg;
			            resetTryEntry(entry);
			          }
			          return thrown;
			        }
			      }

			      // The context.catch method must only be called with a location
			      // argument that corresponds to a known catch block.
			      throw new Error("illegal catch attempt");
			    },

			    delegateYield: function(iterable, resultName, nextLoc) {
			      this.delegate = {
			        iterator: values(iterable),
			        resultName: resultName,
			        nextLoc: nextLoc
			      };

			      if (this.method === "next") {
			        // Deliberately forget the last sent value so that we don't
			        // accidentally pass it on to the delegate.
			        this.arg = undefined$1;
			      }

			      return ContinueSentinel;
			    }
			  };

			  // Regardless of whether this script is executing as a CommonJS module
			  // or not, return the runtime object so that we can declare the variable
			  // regeneratorRuntime in the outer scope, which allows this module to be
			  // injected easily by `bin/regenerator --include-runtime script.js`.
			  return exports;

			}(
			  // If this script is executing as a CommonJS module, use module.exports
			  // as the regeneratorRuntime namespace. Otherwise create a new empty
			  // object. Either way, the resulting object will be used to initialize
			  // the regeneratorRuntime variable at the top of this file.
			  module.exports 
			));

			try {
			  regeneratorRuntime = runtime;
			} catch (accidentalStrictMode) {
			  // This module should not be running in strict mode, so the above
			  // assignment should always work unless something is misconfigured. Just
			  // in case runtime.js accidentally runs in strict mode, in modern engines
			  // we can explicitly access globalThis. In older engines we can escape
			  // strict mode using a global Function call. This could conceivably fail
			  // if a Content Security Policy forbids using Function, but in that case
			  // the proper solution is to fix the accidental strict mode problem. If
			  // you've misconfigured your bundler to force strict mode and applied a
			  // CSP to forbid Function, and you're not willing to fix either of those
			  // problems, please detail your unique predicament in a GitHub issue.
			  if (typeof globalThis === "object") {
			    globalThis.regeneratorRuntime = runtime;
			  } else {
			    Function("r", "regeneratorRuntime = r")(runtime);
			  }
			} 
		} (runtime));
		return runtime.exports;
	}

	requireRuntime();

	var es_symbol = {};

	var es_symbol_constructor = {};

	var globalThis_1;
	var hasRequiredGlobalThis;

	function requireGlobalThis () {
		if (hasRequiredGlobalThis) return globalThis_1;
		hasRequiredGlobalThis = 1;
		var check = function (it) {
		  return it && it.Math === Math && it;
		};

		// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
		globalThis_1 =
		  // eslint-disable-next-line es/no-global-this -- safe
		  check(typeof globalThis == 'object' && globalThis) ||
		  check(typeof window == 'object' && window) ||
		  // eslint-disable-next-line no-restricted-globals -- safe
		  check(typeof self == 'object' && self) ||
		  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
		  check(typeof globalThis_1 == 'object' && globalThis_1) ||
		  // eslint-disable-next-line no-new-func -- fallback
		  (function () { return this; })() || Function('return this')();
		return globalThis_1;
	}

	var objectGetOwnPropertyDescriptor = {};

	var fails;
	var hasRequiredFails;

	function requireFails () {
		if (hasRequiredFails) return fails;
		hasRequiredFails = 1;
		fails = function (exec) {
		  try {
		    return !!exec();
		  } catch (error) {
		    return true;
		  }
		};
		return fails;
	}

	var descriptors;
	var hasRequiredDescriptors;

	function requireDescriptors () {
		if (hasRequiredDescriptors) return descriptors;
		hasRequiredDescriptors = 1;
		var fails = requireFails();

		// Detect IE8's incomplete defineProperty implementation
		descriptors = !fails(function () {
		  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
		  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
		});
		return descriptors;
	}

	var functionBindNative;
	var hasRequiredFunctionBindNative;

	function requireFunctionBindNative () {
		if (hasRequiredFunctionBindNative) return functionBindNative;
		hasRequiredFunctionBindNative = 1;
		var fails = requireFails();

		functionBindNative = !fails(function () {
		  // eslint-disable-next-line es/no-function-prototype-bind -- safe
		  var test = (function () { /* empty */ }).bind();
		  // eslint-disable-next-line no-prototype-builtins -- safe
		  return typeof test != 'function' || test.hasOwnProperty('prototype');
		});
		return functionBindNative;
	}

	var functionCall;
	var hasRequiredFunctionCall;

	function requireFunctionCall () {
		if (hasRequiredFunctionCall) return functionCall;
		hasRequiredFunctionCall = 1;
		var NATIVE_BIND = requireFunctionBindNative();

		var call = Function.prototype.call;

		functionCall = NATIVE_BIND ? call.bind(call) : function () {
		  return call.apply(call, arguments);
		};
		return functionCall;
	}

	var objectPropertyIsEnumerable = {};

	var hasRequiredObjectPropertyIsEnumerable;

	function requireObjectPropertyIsEnumerable () {
		if (hasRequiredObjectPropertyIsEnumerable) return objectPropertyIsEnumerable;
		hasRequiredObjectPropertyIsEnumerable = 1;
		var $propertyIsEnumerable = {}.propertyIsEnumerable;
		// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

		// Nashorn ~ JDK8 bug
		var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

		// `Object.prototype.propertyIsEnumerable` method implementation
		// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
		objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
		  var descriptor = getOwnPropertyDescriptor(this, V);
		  return !!descriptor && descriptor.enumerable;
		} : $propertyIsEnumerable;
		return objectPropertyIsEnumerable;
	}

	var createPropertyDescriptor;
	var hasRequiredCreatePropertyDescriptor;

	function requireCreatePropertyDescriptor () {
		if (hasRequiredCreatePropertyDescriptor) return createPropertyDescriptor;
		hasRequiredCreatePropertyDescriptor = 1;
		createPropertyDescriptor = function (bitmap, value) {
		  return {
		    enumerable: !(bitmap & 1),
		    configurable: !(bitmap & 2),
		    writable: !(bitmap & 4),
		    value: value
		  };
		};
		return createPropertyDescriptor;
	}

	var functionUncurryThis;
	var hasRequiredFunctionUncurryThis;

	function requireFunctionUncurryThis () {
		if (hasRequiredFunctionUncurryThis) return functionUncurryThis;
		hasRequiredFunctionUncurryThis = 1;
		var NATIVE_BIND = requireFunctionBindNative();

		var FunctionPrototype = Function.prototype;
		var call = FunctionPrototype.call;
		var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

		functionUncurryThis = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
		  return function () {
		    return call.apply(fn, arguments);
		  };
		};
		return functionUncurryThis;
	}

	var classofRaw;
	var hasRequiredClassofRaw;

	function requireClassofRaw () {
		if (hasRequiredClassofRaw) return classofRaw;
		hasRequiredClassofRaw = 1;
		var uncurryThis = requireFunctionUncurryThis();

		var toString = uncurryThis({}.toString);
		var stringSlice = uncurryThis(''.slice);

		classofRaw = function (it) {
		  return stringSlice(toString(it), 8, -1);
		};
		return classofRaw;
	}

	var indexedObject;
	var hasRequiredIndexedObject;

	function requireIndexedObject () {
		if (hasRequiredIndexedObject) return indexedObject;
		hasRequiredIndexedObject = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var fails = requireFails();
		var classof = requireClassofRaw();

		var $Object = Object;
		var split = uncurryThis(''.split);

		// fallback for non-array-like ES3 and non-enumerable old V8 strings
		indexedObject = fails(function () {
		  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
		  // eslint-disable-next-line no-prototype-builtins -- safe
		  return !$Object('z').propertyIsEnumerable(0);
		}) ? function (it) {
		  return classof(it) === 'String' ? split(it, '') : $Object(it);
		} : $Object;
		return indexedObject;
	}

	var isNullOrUndefined;
	var hasRequiredIsNullOrUndefined;

	function requireIsNullOrUndefined () {
		if (hasRequiredIsNullOrUndefined) return isNullOrUndefined;
		hasRequiredIsNullOrUndefined = 1;
		// we can't use just `it == null` since of `document.all` special case
		// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
		isNullOrUndefined = function (it) {
		  return it === null || it === undefined;
		};
		return isNullOrUndefined;
	}

	var requireObjectCoercible;
	var hasRequiredRequireObjectCoercible;

	function requireRequireObjectCoercible () {
		if (hasRequiredRequireObjectCoercible) return requireObjectCoercible;
		hasRequiredRequireObjectCoercible = 1;
		var isNullOrUndefined = requireIsNullOrUndefined();

		var $TypeError = TypeError;

		// `RequireObjectCoercible` abstract operation
		// https://tc39.es/ecma262/#sec-requireobjectcoercible
		requireObjectCoercible = function (it) {
		  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
		  return it;
		};
		return requireObjectCoercible;
	}

	var toIndexedObject;
	var hasRequiredToIndexedObject;

	function requireToIndexedObject () {
		if (hasRequiredToIndexedObject) return toIndexedObject;
		hasRequiredToIndexedObject = 1;
		// toObject with fallback for non-array-like ES3 strings
		var IndexedObject = requireIndexedObject();
		var requireObjectCoercible = requireRequireObjectCoercible();

		toIndexedObject = function (it) {
		  return IndexedObject(requireObjectCoercible(it));
		};
		return toIndexedObject;
	}

	var isCallable;
	var hasRequiredIsCallable;

	function requireIsCallable () {
		if (hasRequiredIsCallable) return isCallable;
		hasRequiredIsCallable = 1;
		// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
		var documentAll = typeof document == 'object' && document.all;

		// `IsCallable` abstract operation
		// https://tc39.es/ecma262/#sec-iscallable
		// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
		isCallable = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
		  return typeof argument == 'function' || argument === documentAll;
		} : function (argument) {
		  return typeof argument == 'function';
		};
		return isCallable;
	}

	var isObject;
	var hasRequiredIsObject;

	function requireIsObject () {
		if (hasRequiredIsObject) return isObject;
		hasRequiredIsObject = 1;
		var isCallable = requireIsCallable();

		isObject = function (it) {
		  return typeof it == 'object' ? it !== null : isCallable(it);
		};
		return isObject;
	}

	var getBuiltIn;
	var hasRequiredGetBuiltIn;

	function requireGetBuiltIn () {
		if (hasRequiredGetBuiltIn) return getBuiltIn;
		hasRequiredGetBuiltIn = 1;
		var globalThis = requireGlobalThis();
		var isCallable = requireIsCallable();

		var aFunction = function (argument) {
		  return isCallable(argument) ? argument : undefined;
		};

		getBuiltIn = function (namespace, method) {
		  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
		};
		return getBuiltIn;
	}

	var objectIsPrototypeOf;
	var hasRequiredObjectIsPrototypeOf;

	function requireObjectIsPrototypeOf () {
		if (hasRequiredObjectIsPrototypeOf) return objectIsPrototypeOf;
		hasRequiredObjectIsPrototypeOf = 1;
		var uncurryThis = requireFunctionUncurryThis();

		objectIsPrototypeOf = uncurryThis({}.isPrototypeOf);
		return objectIsPrototypeOf;
	}

	var environmentUserAgent;
	var hasRequiredEnvironmentUserAgent;

	function requireEnvironmentUserAgent () {
		if (hasRequiredEnvironmentUserAgent) return environmentUserAgent;
		hasRequiredEnvironmentUserAgent = 1;
		var globalThis = requireGlobalThis();

		var navigator = globalThis.navigator;
		var userAgent = navigator && navigator.userAgent;

		environmentUserAgent = userAgent ? String(userAgent) : '';
		return environmentUserAgent;
	}

	var environmentV8Version;
	var hasRequiredEnvironmentV8Version;

	function requireEnvironmentV8Version () {
		if (hasRequiredEnvironmentV8Version) return environmentV8Version;
		hasRequiredEnvironmentV8Version = 1;
		var globalThis = requireGlobalThis();
		var userAgent = requireEnvironmentUserAgent();

		var process = globalThis.process;
		var Deno = globalThis.Deno;
		var versions = process && process.versions || Deno && Deno.version;
		var v8 = versions && versions.v8;
		var match, version;

		if (v8) {
		  match = v8.split('.');
		  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
		  // but their correct versions are not interesting for us
		  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
		}

		// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
		// so check `userAgent` even if `.v8` exists, but 0
		if (!version && userAgent) {
		  match = userAgent.match(/Edge\/(\d+)/);
		  if (!match || match[1] >= 74) {
		    match = userAgent.match(/Chrome\/(\d+)/);
		    if (match) version = +match[1];
		  }
		}

		environmentV8Version = version;
		return environmentV8Version;
	}

	var symbolConstructorDetection;
	var hasRequiredSymbolConstructorDetection;

	function requireSymbolConstructorDetection () {
		if (hasRequiredSymbolConstructorDetection) return symbolConstructorDetection;
		hasRequiredSymbolConstructorDetection = 1;
		/* eslint-disable es/no-symbol -- required for testing */
		var V8_VERSION = requireEnvironmentV8Version();
		var fails = requireFails();
		var globalThis = requireGlobalThis();

		var $String = globalThis.String;

		// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
		symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails(function () {
		  var symbol = Symbol('symbol detection');
		  // Chrome 38 Symbol has incorrect toString conversion
		  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
		  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
		  // of course, fail.
		  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
		    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
		    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
		});
		return symbolConstructorDetection;
	}

	var useSymbolAsUid;
	var hasRequiredUseSymbolAsUid;

	function requireUseSymbolAsUid () {
		if (hasRequiredUseSymbolAsUid) return useSymbolAsUid;
		hasRequiredUseSymbolAsUid = 1;
		/* eslint-disable es/no-symbol -- required for testing */
		var NATIVE_SYMBOL = requireSymbolConstructorDetection();

		useSymbolAsUid = NATIVE_SYMBOL &&
		  !Symbol.sham &&
		  typeof Symbol.iterator == 'symbol';
		return useSymbolAsUid;
	}

	var isSymbol;
	var hasRequiredIsSymbol;

	function requireIsSymbol () {
		if (hasRequiredIsSymbol) return isSymbol;
		hasRequiredIsSymbol = 1;
		var getBuiltIn = requireGetBuiltIn();
		var isCallable = requireIsCallable();
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();

		var $Object = Object;

		isSymbol = USE_SYMBOL_AS_UID ? function (it) {
		  return typeof it == 'symbol';
		} : function (it) {
		  var $Symbol = getBuiltIn('Symbol');
		  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
		};
		return isSymbol;
	}

	var tryToString;
	var hasRequiredTryToString;

	function requireTryToString () {
		if (hasRequiredTryToString) return tryToString;
		hasRequiredTryToString = 1;
		var $String = String;

		tryToString = function (argument) {
		  try {
		    return $String(argument);
		  } catch (error) {
		    return 'Object';
		  }
		};
		return tryToString;
	}

	var aCallable;
	var hasRequiredACallable;

	function requireACallable () {
		if (hasRequiredACallable) return aCallable;
		hasRequiredACallable = 1;
		var isCallable = requireIsCallable();
		var tryToString = requireTryToString();

		var $TypeError = TypeError;

		// `Assert: IsCallable(argument) is true`
		aCallable = function (argument) {
		  if (isCallable(argument)) return argument;
		  throw new $TypeError(tryToString(argument) + ' is not a function');
		};
		return aCallable;
	}

	var getMethod;
	var hasRequiredGetMethod;

	function requireGetMethod () {
		if (hasRequiredGetMethod) return getMethod;
		hasRequiredGetMethod = 1;
		var aCallable = requireACallable();
		var isNullOrUndefined = requireIsNullOrUndefined();

		// `GetMethod` abstract operation
		// https://tc39.es/ecma262/#sec-getmethod
		getMethod = function (V, P) {
		  var func = V[P];
		  return isNullOrUndefined(func) ? undefined : aCallable(func);
		};
		return getMethod;
	}

	var ordinaryToPrimitive;
	var hasRequiredOrdinaryToPrimitive;

	function requireOrdinaryToPrimitive () {
		if (hasRequiredOrdinaryToPrimitive) return ordinaryToPrimitive;
		hasRequiredOrdinaryToPrimitive = 1;
		var call = requireFunctionCall();
		var isCallable = requireIsCallable();
		var isObject = requireIsObject();

		var $TypeError = TypeError;

		// `OrdinaryToPrimitive` abstract operation
		// https://tc39.es/ecma262/#sec-ordinarytoprimitive
		ordinaryToPrimitive = function (input, pref) {
		  var fn, val;
		  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
		  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
		  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
		  throw new $TypeError("Can't convert object to primitive value");
		};
		return ordinaryToPrimitive;
	}

	var sharedStore = {exports: {}};

	var isPure;
	var hasRequiredIsPure;

	function requireIsPure () {
		if (hasRequiredIsPure) return isPure;
		hasRequiredIsPure = 1;
		isPure = false;
		return isPure;
	}

	var defineGlobalProperty;
	var hasRequiredDefineGlobalProperty;

	function requireDefineGlobalProperty () {
		if (hasRequiredDefineGlobalProperty) return defineGlobalProperty;
		hasRequiredDefineGlobalProperty = 1;
		var globalThis = requireGlobalThis();

		// eslint-disable-next-line es/no-object-defineproperty -- safe
		var defineProperty = Object.defineProperty;

		defineGlobalProperty = function (key, value) {
		  try {
		    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
		  } catch (error) {
		    globalThis[key] = value;
		  } return value;
		};
		return defineGlobalProperty;
	}

	var hasRequiredSharedStore;

	function requireSharedStore () {
		if (hasRequiredSharedStore) return sharedStore.exports;
		hasRequiredSharedStore = 1;
		var IS_PURE = requireIsPure();
		var globalThis = requireGlobalThis();
		var defineGlobalProperty = requireDefineGlobalProperty();

		var SHARED = '__core-js_shared__';
		var store = sharedStore.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

		(store.versions || (store.versions = [])).push({
		  version: '3.39.0',
		  mode: IS_PURE ? 'pure' : 'global',
		  copyright: '© 2014-2024 Denis Pushkarev (zloirock.ru)',
		  license: 'https://github.com/zloirock/core-js/blob/v3.39.0/LICENSE',
		  source: 'https://github.com/zloirock/core-js'
		});
		return sharedStore.exports;
	}

	var shared;
	var hasRequiredShared;

	function requireShared () {
		if (hasRequiredShared) return shared;
		hasRequiredShared = 1;
		var store = requireSharedStore();

		shared = function (key, value) {
		  return store[key] || (store[key] = value || {});
		};
		return shared;
	}

	var toObject;
	var hasRequiredToObject;

	function requireToObject () {
		if (hasRequiredToObject) return toObject;
		hasRequiredToObject = 1;
		var requireObjectCoercible = requireRequireObjectCoercible();

		var $Object = Object;

		// `ToObject` abstract operation
		// https://tc39.es/ecma262/#sec-toobject
		toObject = function (argument) {
		  return $Object(requireObjectCoercible(argument));
		};
		return toObject;
	}

	var hasOwnProperty_1;
	var hasRequiredHasOwnProperty;

	function requireHasOwnProperty () {
		if (hasRequiredHasOwnProperty) return hasOwnProperty_1;
		hasRequiredHasOwnProperty = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var toObject = requireToObject();

		var hasOwnProperty = uncurryThis({}.hasOwnProperty);

		// `HasOwnProperty` abstract operation
		// https://tc39.es/ecma262/#sec-hasownproperty
		// eslint-disable-next-line es/no-object-hasown -- safe
		hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
		  return hasOwnProperty(toObject(it), key);
		};
		return hasOwnProperty_1;
	}

	var uid;
	var hasRequiredUid;

	function requireUid () {
		if (hasRequiredUid) return uid;
		hasRequiredUid = 1;
		var uncurryThis = requireFunctionUncurryThis();

		var id = 0;
		var postfix = Math.random();
		var toString = uncurryThis(1.0.toString);

		uid = function (key) {
		  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
		};
		return uid;
	}

	var wellKnownSymbol;
	var hasRequiredWellKnownSymbol;

	function requireWellKnownSymbol () {
		if (hasRequiredWellKnownSymbol) return wellKnownSymbol;
		hasRequiredWellKnownSymbol = 1;
		var globalThis = requireGlobalThis();
		var shared = requireShared();
		var hasOwn = requireHasOwnProperty();
		var uid = requireUid();
		var NATIVE_SYMBOL = requireSymbolConstructorDetection();
		var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();

		var Symbol = globalThis.Symbol;
		var WellKnownSymbolsStore = shared('wks');
		var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

		wellKnownSymbol = function (name) {
		  if (!hasOwn(WellKnownSymbolsStore, name)) {
		    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
		      ? Symbol[name]
		      : createWellKnownSymbol('Symbol.' + name);
		  } return WellKnownSymbolsStore[name];
		};
		return wellKnownSymbol;
	}

	var toPrimitive;
	var hasRequiredToPrimitive;

	function requireToPrimitive () {
		if (hasRequiredToPrimitive) return toPrimitive;
		hasRequiredToPrimitive = 1;
		var call = requireFunctionCall();
		var isObject = requireIsObject();
		var isSymbol = requireIsSymbol();
		var getMethod = requireGetMethod();
		var ordinaryToPrimitive = requireOrdinaryToPrimitive();
		var wellKnownSymbol = requireWellKnownSymbol();

		var $TypeError = TypeError;
		var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

		// `ToPrimitive` abstract operation
		// https://tc39.es/ecma262/#sec-toprimitive
		toPrimitive = function (input, pref) {
		  if (!isObject(input) || isSymbol(input)) return input;
		  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
		  var result;
		  if (exoticToPrim) {
		    if (pref === undefined) pref = 'default';
		    result = call(exoticToPrim, input, pref);
		    if (!isObject(result) || isSymbol(result)) return result;
		    throw new $TypeError("Can't convert object to primitive value");
		  }
		  if (pref === undefined) pref = 'number';
		  return ordinaryToPrimitive(input, pref);
		};
		return toPrimitive;
	}

	var toPropertyKey;
	var hasRequiredToPropertyKey;

	function requireToPropertyKey () {
		if (hasRequiredToPropertyKey) return toPropertyKey;
		hasRequiredToPropertyKey = 1;
		var toPrimitive = requireToPrimitive();
		var isSymbol = requireIsSymbol();

		// `ToPropertyKey` abstract operation
		// https://tc39.es/ecma262/#sec-topropertykey
		toPropertyKey = function (argument) {
		  var key = toPrimitive(argument, 'string');
		  return isSymbol(key) ? key : key + '';
		};
		return toPropertyKey;
	}

	var documentCreateElement;
	var hasRequiredDocumentCreateElement;

	function requireDocumentCreateElement () {
		if (hasRequiredDocumentCreateElement) return documentCreateElement;
		hasRequiredDocumentCreateElement = 1;
		var globalThis = requireGlobalThis();
		var isObject = requireIsObject();

		var document = globalThis.document;
		// typeof document.createElement is 'object' in old IE
		var EXISTS = isObject(document) && isObject(document.createElement);

		documentCreateElement = function (it) {
		  return EXISTS ? document.createElement(it) : {};
		};
		return documentCreateElement;
	}

	var ie8DomDefine;
	var hasRequiredIe8DomDefine;

	function requireIe8DomDefine () {
		if (hasRequiredIe8DomDefine) return ie8DomDefine;
		hasRequiredIe8DomDefine = 1;
		var DESCRIPTORS = requireDescriptors();
		var fails = requireFails();
		var createElement = requireDocumentCreateElement();

		// Thanks to IE8 for its funny defineProperty
		ie8DomDefine = !DESCRIPTORS && !fails(function () {
		  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
		  return Object.defineProperty(createElement('div'), 'a', {
		    get: function () { return 7; }
		  }).a !== 7;
		});
		return ie8DomDefine;
	}

	var hasRequiredObjectGetOwnPropertyDescriptor;

	function requireObjectGetOwnPropertyDescriptor () {
		if (hasRequiredObjectGetOwnPropertyDescriptor) return objectGetOwnPropertyDescriptor;
		hasRequiredObjectGetOwnPropertyDescriptor = 1;
		var DESCRIPTORS = requireDescriptors();
		var call = requireFunctionCall();
		var propertyIsEnumerableModule = requireObjectPropertyIsEnumerable();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();
		var toIndexedObject = requireToIndexedObject();
		var toPropertyKey = requireToPropertyKey();
		var hasOwn = requireHasOwnProperty();
		var IE8_DOM_DEFINE = requireIe8DomDefine();

		// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

		// `Object.getOwnPropertyDescriptor` method
		// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
		objectGetOwnPropertyDescriptor.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
		  O = toIndexedObject(O);
		  P = toPropertyKey(P);
		  if (IE8_DOM_DEFINE) try {
		    return $getOwnPropertyDescriptor(O, P);
		  } catch (error) { /* empty */ }
		  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
		};
		return objectGetOwnPropertyDescriptor;
	}

	var objectDefineProperty = {};

	var v8PrototypeDefineBug;
	var hasRequiredV8PrototypeDefineBug;

	function requireV8PrototypeDefineBug () {
		if (hasRequiredV8PrototypeDefineBug) return v8PrototypeDefineBug;
		hasRequiredV8PrototypeDefineBug = 1;
		var DESCRIPTORS = requireDescriptors();
		var fails = requireFails();

		// V8 ~ Chrome 36-
		// https://bugs.chromium.org/p/v8/issues/detail?id=3334
		v8PrototypeDefineBug = DESCRIPTORS && fails(function () {
		  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
		  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
		    value: 42,
		    writable: false
		  }).prototype !== 42;
		});
		return v8PrototypeDefineBug;
	}

	var anObject;
	var hasRequiredAnObject;

	function requireAnObject () {
		if (hasRequiredAnObject) return anObject;
		hasRequiredAnObject = 1;
		var isObject = requireIsObject();

		var $String = String;
		var $TypeError = TypeError;

		// `Assert: Type(argument) is Object`
		anObject = function (argument) {
		  if (isObject(argument)) return argument;
		  throw new $TypeError($String(argument) + ' is not an object');
		};
		return anObject;
	}

	var hasRequiredObjectDefineProperty;

	function requireObjectDefineProperty () {
		if (hasRequiredObjectDefineProperty) return objectDefineProperty;
		hasRequiredObjectDefineProperty = 1;
		var DESCRIPTORS = requireDescriptors();
		var IE8_DOM_DEFINE = requireIe8DomDefine();
		var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
		var anObject = requireAnObject();
		var toPropertyKey = requireToPropertyKey();

		var $TypeError = TypeError;
		// eslint-disable-next-line es/no-object-defineproperty -- safe
		var $defineProperty = Object.defineProperty;
		// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
		var ENUMERABLE = 'enumerable';
		var CONFIGURABLE = 'configurable';
		var WRITABLE = 'writable';

		// `Object.defineProperty` method
		// https://tc39.es/ecma262/#sec-object.defineproperty
		objectDefineProperty.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
		  anObject(O);
		  P = toPropertyKey(P);
		  anObject(Attributes);
		  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
		    var current = $getOwnPropertyDescriptor(O, P);
		    if (current && current[WRITABLE]) {
		      O[P] = Attributes.value;
		      Attributes = {
		        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
		        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
		        writable: false
		      };
		    }
		  } return $defineProperty(O, P, Attributes);
		} : $defineProperty : function defineProperty(O, P, Attributes) {
		  anObject(O);
		  P = toPropertyKey(P);
		  anObject(Attributes);
		  if (IE8_DOM_DEFINE) try {
		    return $defineProperty(O, P, Attributes);
		  } catch (error) { /* empty */ }
		  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
		  if ('value' in Attributes) O[P] = Attributes.value;
		  return O;
		};
		return objectDefineProperty;
	}

	var createNonEnumerableProperty;
	var hasRequiredCreateNonEnumerableProperty;

	function requireCreateNonEnumerableProperty () {
		if (hasRequiredCreateNonEnumerableProperty) return createNonEnumerableProperty;
		hasRequiredCreateNonEnumerableProperty = 1;
		var DESCRIPTORS = requireDescriptors();
		var definePropertyModule = requireObjectDefineProperty();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();

		createNonEnumerableProperty = DESCRIPTORS ? function (object, key, value) {
		  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
		} : function (object, key, value) {
		  object[key] = value;
		  return object;
		};
		return createNonEnumerableProperty;
	}

	var makeBuiltIn = {exports: {}};

	var functionName;
	var hasRequiredFunctionName;

	function requireFunctionName () {
		if (hasRequiredFunctionName) return functionName;
		hasRequiredFunctionName = 1;
		var DESCRIPTORS = requireDescriptors();
		var hasOwn = requireHasOwnProperty();

		var FunctionPrototype = Function.prototype;
		// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

		var EXISTS = hasOwn(FunctionPrototype, 'name');
		// additional protection from minified / mangled / dropped function names
		var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
		var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

		functionName = {
		  EXISTS: EXISTS,
		  PROPER: PROPER,
		  CONFIGURABLE: CONFIGURABLE
		};
		return functionName;
	}

	var inspectSource;
	var hasRequiredInspectSource;

	function requireInspectSource () {
		if (hasRequiredInspectSource) return inspectSource;
		hasRequiredInspectSource = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var isCallable = requireIsCallable();
		var store = requireSharedStore();

		var functionToString = uncurryThis(Function.toString);

		// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
		if (!isCallable(store.inspectSource)) {
		  store.inspectSource = function (it) {
		    return functionToString(it);
		  };
		}

		inspectSource = store.inspectSource;
		return inspectSource;
	}

	var weakMapBasicDetection;
	var hasRequiredWeakMapBasicDetection;

	function requireWeakMapBasicDetection () {
		if (hasRequiredWeakMapBasicDetection) return weakMapBasicDetection;
		hasRequiredWeakMapBasicDetection = 1;
		var globalThis = requireGlobalThis();
		var isCallable = requireIsCallable();

		var WeakMap = globalThis.WeakMap;

		weakMapBasicDetection = isCallable(WeakMap) && /native code/.test(String(WeakMap));
		return weakMapBasicDetection;
	}

	var sharedKey;
	var hasRequiredSharedKey;

	function requireSharedKey () {
		if (hasRequiredSharedKey) return sharedKey;
		hasRequiredSharedKey = 1;
		var shared = requireShared();
		var uid = requireUid();

		var keys = shared('keys');

		sharedKey = function (key) {
		  return keys[key] || (keys[key] = uid(key));
		};
		return sharedKey;
	}

	var hiddenKeys;
	var hasRequiredHiddenKeys;

	function requireHiddenKeys () {
		if (hasRequiredHiddenKeys) return hiddenKeys;
		hasRequiredHiddenKeys = 1;
		hiddenKeys = {};
		return hiddenKeys;
	}

	var internalState;
	var hasRequiredInternalState;

	function requireInternalState () {
		if (hasRequiredInternalState) return internalState;
		hasRequiredInternalState = 1;
		var NATIVE_WEAK_MAP = requireWeakMapBasicDetection();
		var globalThis = requireGlobalThis();
		var isObject = requireIsObject();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var hasOwn = requireHasOwnProperty();
		var shared = requireSharedStore();
		var sharedKey = requireSharedKey();
		var hiddenKeys = requireHiddenKeys();

		var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
		var TypeError = globalThis.TypeError;
		var WeakMap = globalThis.WeakMap;
		var set, get, has;

		var enforce = function (it) {
		  return has(it) ? get(it) : set(it, {});
		};

		var getterFor = function (TYPE) {
		  return function (it) {
		    var state;
		    if (!isObject(it) || (state = get(it)).type !== TYPE) {
		      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
		    } return state;
		  };
		};

		if (NATIVE_WEAK_MAP || shared.state) {
		  var store = shared.state || (shared.state = new WeakMap());
		  /* eslint-disable no-self-assign -- prototype methods protection */
		  store.get = store.get;
		  store.has = store.has;
		  store.set = store.set;
		  /* eslint-enable no-self-assign -- prototype methods protection */
		  set = function (it, metadata) {
		    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
		    metadata.facade = it;
		    store.set(it, metadata);
		    return metadata;
		  };
		  get = function (it) {
		    return store.get(it) || {};
		  };
		  has = function (it) {
		    return store.has(it);
		  };
		} else {
		  var STATE = sharedKey('state');
		  hiddenKeys[STATE] = true;
		  set = function (it, metadata) {
		    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
		    metadata.facade = it;
		    createNonEnumerableProperty(it, STATE, metadata);
		    return metadata;
		  };
		  get = function (it) {
		    return hasOwn(it, STATE) ? it[STATE] : {};
		  };
		  has = function (it) {
		    return hasOwn(it, STATE);
		  };
		}

		internalState = {
		  set: set,
		  get: get,
		  has: has,
		  enforce: enforce,
		  getterFor: getterFor
		};
		return internalState;
	}

	var hasRequiredMakeBuiltIn;

	function requireMakeBuiltIn () {
		if (hasRequiredMakeBuiltIn) return makeBuiltIn.exports;
		hasRequiredMakeBuiltIn = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var fails = requireFails();
		var isCallable = requireIsCallable();
		var hasOwn = requireHasOwnProperty();
		var DESCRIPTORS = requireDescriptors();
		var CONFIGURABLE_FUNCTION_NAME = requireFunctionName().CONFIGURABLE;
		var inspectSource = requireInspectSource();
		var InternalStateModule = requireInternalState();

		var enforceInternalState = InternalStateModule.enforce;
		var getInternalState = InternalStateModule.get;
		var $String = String;
		// eslint-disable-next-line es/no-object-defineproperty -- safe
		var defineProperty = Object.defineProperty;
		var stringSlice = uncurryThis(''.slice);
		var replace = uncurryThis(''.replace);
		var join = uncurryThis([].join);

		var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
		  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
		});

		var TEMPLATE = String(String).split('String');

		var makeBuiltIn$1 = makeBuiltIn.exports = function (value, name, options) {
		  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
		    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
		  }
		  if (options && options.getter) name = 'get ' + name;
		  if (options && options.setter) name = 'set ' + name;
		  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
		    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
		    else value.name = name;
		  }
		  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
		    defineProperty(value, 'length', { value: options.arity });
		  }
		  try {
		    if (options && hasOwn(options, 'constructor') && options.constructor) {
		      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
		    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
		    } else if (value.prototype) value.prototype = undefined;
		  } catch (error) { /* empty */ }
		  var state = enforceInternalState(value);
		  if (!hasOwn(state, 'source')) {
		    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
		  } return value;
		};

		// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
		// eslint-disable-next-line no-extend-native -- required
		Function.prototype.toString = makeBuiltIn$1(function toString() {
		  return isCallable(this) && getInternalState(this).source || inspectSource(this);
		}, 'toString');
		return makeBuiltIn.exports;
	}

	var defineBuiltIn;
	var hasRequiredDefineBuiltIn;

	function requireDefineBuiltIn () {
		if (hasRequiredDefineBuiltIn) return defineBuiltIn;
		hasRequiredDefineBuiltIn = 1;
		var isCallable = requireIsCallable();
		var definePropertyModule = requireObjectDefineProperty();
		var makeBuiltIn = requireMakeBuiltIn();
		var defineGlobalProperty = requireDefineGlobalProperty();

		defineBuiltIn = function (O, key, value, options) {
		  if (!options) options = {};
		  var simple = options.enumerable;
		  var name = options.name !== undefined ? options.name : key;
		  if (isCallable(value)) makeBuiltIn(value, name, options);
		  if (options.global) {
		    if (simple) O[key] = value;
		    else defineGlobalProperty(key, value);
		  } else {
		    try {
		      if (!options.unsafe) delete O[key];
		      else if (O[key]) simple = true;
		    } catch (error) { /* empty */ }
		    if (simple) O[key] = value;
		    else definePropertyModule.f(O, key, {
		      value: value,
		      enumerable: false,
		      configurable: !options.nonConfigurable,
		      writable: !options.nonWritable
		    });
		  } return O;
		};
		return defineBuiltIn;
	}

	var objectGetOwnPropertyNames = {};

	var mathTrunc;
	var hasRequiredMathTrunc;

	function requireMathTrunc () {
		if (hasRequiredMathTrunc) return mathTrunc;
		hasRequiredMathTrunc = 1;
		var ceil = Math.ceil;
		var floor = Math.floor;

		// `Math.trunc` method
		// https://tc39.es/ecma262/#sec-math.trunc
		// eslint-disable-next-line es/no-math-trunc -- safe
		mathTrunc = Math.trunc || function trunc(x) {
		  var n = +x;
		  return (n > 0 ? floor : ceil)(n);
		};
		return mathTrunc;
	}

	var toIntegerOrInfinity;
	var hasRequiredToIntegerOrInfinity;

	function requireToIntegerOrInfinity () {
		if (hasRequiredToIntegerOrInfinity) return toIntegerOrInfinity;
		hasRequiredToIntegerOrInfinity = 1;
		var trunc = requireMathTrunc();

		// `ToIntegerOrInfinity` abstract operation
		// https://tc39.es/ecma262/#sec-tointegerorinfinity
		toIntegerOrInfinity = function (argument) {
		  var number = +argument;
		  // eslint-disable-next-line no-self-compare -- NaN check
		  return number !== number || number === 0 ? 0 : trunc(number);
		};
		return toIntegerOrInfinity;
	}

	var toAbsoluteIndex;
	var hasRequiredToAbsoluteIndex;

	function requireToAbsoluteIndex () {
		if (hasRequiredToAbsoluteIndex) return toAbsoluteIndex;
		hasRequiredToAbsoluteIndex = 1;
		var toIntegerOrInfinity = requireToIntegerOrInfinity();

		var max = Math.max;
		var min = Math.min;

		// Helper for a popular repeating case of the spec:
		// Let integer be ? ToInteger(index).
		// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
		toAbsoluteIndex = function (index, length) {
		  var integer = toIntegerOrInfinity(index);
		  return integer < 0 ? max(integer + length, 0) : min(integer, length);
		};
		return toAbsoluteIndex;
	}

	var toLength;
	var hasRequiredToLength;

	function requireToLength () {
		if (hasRequiredToLength) return toLength;
		hasRequiredToLength = 1;
		var toIntegerOrInfinity = requireToIntegerOrInfinity();

		var min = Math.min;

		// `ToLength` abstract operation
		// https://tc39.es/ecma262/#sec-tolength
		toLength = function (argument) {
		  var len = toIntegerOrInfinity(argument);
		  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
		};
		return toLength;
	}

	var lengthOfArrayLike;
	var hasRequiredLengthOfArrayLike;

	function requireLengthOfArrayLike () {
		if (hasRequiredLengthOfArrayLike) return lengthOfArrayLike;
		hasRequiredLengthOfArrayLike = 1;
		var toLength = requireToLength();

		// `LengthOfArrayLike` abstract operation
		// https://tc39.es/ecma262/#sec-lengthofarraylike
		lengthOfArrayLike = function (obj) {
		  return toLength(obj.length);
		};
		return lengthOfArrayLike;
	}

	var arrayIncludes;
	var hasRequiredArrayIncludes;

	function requireArrayIncludes () {
		if (hasRequiredArrayIncludes) return arrayIncludes;
		hasRequiredArrayIncludes = 1;
		var toIndexedObject = requireToIndexedObject();
		var toAbsoluteIndex = requireToAbsoluteIndex();
		var lengthOfArrayLike = requireLengthOfArrayLike();

		// `Array.prototype.{ indexOf, includes }` methods implementation
		var createMethod = function (IS_INCLUDES) {
		  return function ($this, el, fromIndex) {
		    var O = toIndexedObject($this);
		    var length = lengthOfArrayLike(O);
		    if (length === 0) return !IS_INCLUDES && -1;
		    var index = toAbsoluteIndex(fromIndex, length);
		    var value;
		    // Array#includes uses SameValueZero equality algorithm
		    // eslint-disable-next-line no-self-compare -- NaN check
		    if (IS_INCLUDES && el !== el) while (length > index) {
		      value = O[index++];
		      // eslint-disable-next-line no-self-compare -- NaN check
		      if (value !== value) return true;
		    // Array#indexOf ignores holes, Array#includes - not
		    } else for (;length > index; index++) {
		      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
		    } return !IS_INCLUDES && -1;
		  };
		};

		arrayIncludes = {
		  // `Array.prototype.includes` method
		  // https://tc39.es/ecma262/#sec-array.prototype.includes
		  includes: createMethod(true),
		  // `Array.prototype.indexOf` method
		  // https://tc39.es/ecma262/#sec-array.prototype.indexof
		  indexOf: createMethod(false)
		};
		return arrayIncludes;
	}

	var objectKeysInternal;
	var hasRequiredObjectKeysInternal;

	function requireObjectKeysInternal () {
		if (hasRequiredObjectKeysInternal) return objectKeysInternal;
		hasRequiredObjectKeysInternal = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var hasOwn = requireHasOwnProperty();
		var toIndexedObject = requireToIndexedObject();
		var indexOf = requireArrayIncludes().indexOf;
		var hiddenKeys = requireHiddenKeys();

		var push = uncurryThis([].push);

		objectKeysInternal = function (object, names) {
		  var O = toIndexedObject(object);
		  var i = 0;
		  var result = [];
		  var key;
		  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
		  // Don't enum bug & hidden keys
		  while (names.length > i) if (hasOwn(O, key = names[i++])) {
		    ~indexOf(result, key) || push(result, key);
		  }
		  return result;
		};
		return objectKeysInternal;
	}

	var enumBugKeys;
	var hasRequiredEnumBugKeys;

	function requireEnumBugKeys () {
		if (hasRequiredEnumBugKeys) return enumBugKeys;
		hasRequiredEnumBugKeys = 1;
		// IE8- don't enum bug keys
		enumBugKeys = [
		  'constructor',
		  'hasOwnProperty',
		  'isPrototypeOf',
		  'propertyIsEnumerable',
		  'toLocaleString',
		  'toString',
		  'valueOf'
		];
		return enumBugKeys;
	}

	var hasRequiredObjectGetOwnPropertyNames;

	function requireObjectGetOwnPropertyNames () {
		if (hasRequiredObjectGetOwnPropertyNames) return objectGetOwnPropertyNames;
		hasRequiredObjectGetOwnPropertyNames = 1;
		var internalObjectKeys = requireObjectKeysInternal();
		var enumBugKeys = requireEnumBugKeys();

		var hiddenKeys = enumBugKeys.concat('length', 'prototype');

		// `Object.getOwnPropertyNames` method
		// https://tc39.es/ecma262/#sec-object.getownpropertynames
		// eslint-disable-next-line es/no-object-getownpropertynames -- safe
		objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
		  return internalObjectKeys(O, hiddenKeys);
		};
		return objectGetOwnPropertyNames;
	}

	var objectGetOwnPropertySymbols = {};

	var hasRequiredObjectGetOwnPropertySymbols;

	function requireObjectGetOwnPropertySymbols () {
		if (hasRequiredObjectGetOwnPropertySymbols) return objectGetOwnPropertySymbols;
		hasRequiredObjectGetOwnPropertySymbols = 1;
		// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
		objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;
		return objectGetOwnPropertySymbols;
	}

	var ownKeys;
	var hasRequiredOwnKeys;

	function requireOwnKeys () {
		if (hasRequiredOwnKeys) return ownKeys;
		hasRequiredOwnKeys = 1;
		var getBuiltIn = requireGetBuiltIn();
		var uncurryThis = requireFunctionUncurryThis();
		var getOwnPropertyNamesModule = requireObjectGetOwnPropertyNames();
		var getOwnPropertySymbolsModule = requireObjectGetOwnPropertySymbols();
		var anObject = requireAnObject();

		var concat = uncurryThis([].concat);

		// all object keys, includes non-enumerable and symbols
		ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
		  var keys = getOwnPropertyNamesModule.f(anObject(it));
		  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
		  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
		};
		return ownKeys;
	}

	var copyConstructorProperties;
	var hasRequiredCopyConstructorProperties;

	function requireCopyConstructorProperties () {
		if (hasRequiredCopyConstructorProperties) return copyConstructorProperties;
		hasRequiredCopyConstructorProperties = 1;
		var hasOwn = requireHasOwnProperty();
		var ownKeys = requireOwnKeys();
		var getOwnPropertyDescriptorModule = requireObjectGetOwnPropertyDescriptor();
		var definePropertyModule = requireObjectDefineProperty();

		copyConstructorProperties = function (target, source, exceptions) {
		  var keys = ownKeys(source);
		  var defineProperty = definePropertyModule.f;
		  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
		  for (var i = 0; i < keys.length; i++) {
		    var key = keys[i];
		    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
		      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
		    }
		  }
		};
		return copyConstructorProperties;
	}

	var isForced_1;
	var hasRequiredIsForced;

	function requireIsForced () {
		if (hasRequiredIsForced) return isForced_1;
		hasRequiredIsForced = 1;
		var fails = requireFails();
		var isCallable = requireIsCallable();

		var replacement = /#|\.prototype\./;

		var isForced = function (feature, detection) {
		  var value = data[normalize(feature)];
		  return value === POLYFILL ? true
		    : value === NATIVE ? false
		    : isCallable(detection) ? fails(detection)
		    : !!detection;
		};

		var normalize = isForced.normalize = function (string) {
		  return String(string).replace(replacement, '.').toLowerCase();
		};

		var data = isForced.data = {};
		var NATIVE = isForced.NATIVE = 'N';
		var POLYFILL = isForced.POLYFILL = 'P';

		isForced_1 = isForced;
		return isForced_1;
	}

	var _export;
	var hasRequired_export;

	function require_export () {
		if (hasRequired_export) return _export;
		hasRequired_export = 1;
		var globalThis = requireGlobalThis();
		var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var defineBuiltIn = requireDefineBuiltIn();
		var defineGlobalProperty = requireDefineGlobalProperty();
		var copyConstructorProperties = requireCopyConstructorProperties();
		var isForced = requireIsForced();

		/*
		  options.target         - name of the target object
		  options.global         - target is the global object
		  options.stat           - export as static methods of target
		  options.proto          - export as prototype methods of target
		  options.real           - real prototype method for the `pure` version
		  options.forced         - export even if the native feature is available
		  options.bind           - bind methods to the target, required for the `pure` version
		  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
		  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
		  options.sham           - add a flag to not completely full polyfills
		  options.enumerable     - export as enumerable property
		  options.dontCallGetSet - prevent calling a getter on target
		  options.name           - the .name of the function if it does not match the key
		*/
		_export = function (options, source) {
		  var TARGET = options.target;
		  var GLOBAL = options.global;
		  var STATIC = options.stat;
		  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
		  if (GLOBAL) {
		    target = globalThis;
		  } else if (STATIC) {
		    target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
		  } else {
		    target = globalThis[TARGET] && globalThis[TARGET].prototype;
		  }
		  if (target) for (key in source) {
		    sourceProperty = source[key];
		    if (options.dontCallGetSet) {
		      descriptor = getOwnPropertyDescriptor(target, key);
		      targetProperty = descriptor && descriptor.value;
		    } else targetProperty = target[key];
		    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
		    // contained in target
		    if (!FORCED && targetProperty !== undefined) {
		      if (typeof sourceProperty == typeof targetProperty) continue;
		      copyConstructorProperties(sourceProperty, targetProperty);
		    }
		    // add a flag to not completely full polyfills
		    if (options.sham || (targetProperty && targetProperty.sham)) {
		      createNonEnumerableProperty(sourceProperty, 'sham', true);
		    }
		    defineBuiltIn(target, key, sourceProperty, options);
		  }
		};
		return _export;
	}

	var toStringTagSupport;
	var hasRequiredToStringTagSupport;

	function requireToStringTagSupport () {
		if (hasRequiredToStringTagSupport) return toStringTagSupport;
		hasRequiredToStringTagSupport = 1;
		var wellKnownSymbol = requireWellKnownSymbol();

		var TO_STRING_TAG = wellKnownSymbol('toStringTag');
		var test = {};

		test[TO_STRING_TAG] = 'z';

		toStringTagSupport = String(test) === '[object z]';
		return toStringTagSupport;
	}

	var classof;
	var hasRequiredClassof;

	function requireClassof () {
		if (hasRequiredClassof) return classof;
		hasRequiredClassof = 1;
		var TO_STRING_TAG_SUPPORT = requireToStringTagSupport();
		var isCallable = requireIsCallable();
		var classofRaw = requireClassofRaw();
		var wellKnownSymbol = requireWellKnownSymbol();

		var TO_STRING_TAG = wellKnownSymbol('toStringTag');
		var $Object = Object;

		// ES3 wrong here
		var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

		// fallback for IE11 Script Access Denied error
		var tryGet = function (it, key) {
		  try {
		    return it[key];
		  } catch (error) { /* empty */ }
		};

		// getting tag from ES6+ `Object.prototype.toString`
		classof = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
		  var O, tag, result;
		  return it === undefined ? 'Undefined' : it === null ? 'Null'
		    // @@toStringTag case
		    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
		    // builtinTag case
		    : CORRECT_ARGUMENTS ? classofRaw(O)
		    // ES3 arguments fallback
		    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
		};
		return classof;
	}

	var toString;
	var hasRequiredToString;

	function requireToString () {
		if (hasRequiredToString) return toString;
		hasRequiredToString = 1;
		var classof = requireClassof();

		var $String = String;

		toString = function (argument) {
		  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
		  return $String(argument);
		};
		return toString;
	}

	var objectDefineProperties = {};

	var objectKeys;
	var hasRequiredObjectKeys;

	function requireObjectKeys () {
		if (hasRequiredObjectKeys) return objectKeys;
		hasRequiredObjectKeys = 1;
		var internalObjectKeys = requireObjectKeysInternal();
		var enumBugKeys = requireEnumBugKeys();

		// `Object.keys` method
		// https://tc39.es/ecma262/#sec-object.keys
		// eslint-disable-next-line es/no-object-keys -- safe
		objectKeys = Object.keys || function keys(O) {
		  return internalObjectKeys(O, enumBugKeys);
		};
		return objectKeys;
	}

	var hasRequiredObjectDefineProperties;

	function requireObjectDefineProperties () {
		if (hasRequiredObjectDefineProperties) return objectDefineProperties;
		hasRequiredObjectDefineProperties = 1;
		var DESCRIPTORS = requireDescriptors();
		var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
		var definePropertyModule = requireObjectDefineProperty();
		var anObject = requireAnObject();
		var toIndexedObject = requireToIndexedObject();
		var objectKeys = requireObjectKeys();

		// `Object.defineProperties` method
		// https://tc39.es/ecma262/#sec-object.defineproperties
		// eslint-disable-next-line es/no-object-defineproperties -- safe
		objectDefineProperties.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
		  anObject(O);
		  var props = toIndexedObject(Properties);
		  var keys = objectKeys(Properties);
		  var length = keys.length;
		  var index = 0;
		  var key;
		  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
		  return O;
		};
		return objectDefineProperties;
	}

	var html;
	var hasRequiredHtml;

	function requireHtml () {
		if (hasRequiredHtml) return html;
		hasRequiredHtml = 1;
		var getBuiltIn = requireGetBuiltIn();

		html = getBuiltIn('document', 'documentElement');
		return html;
	}

	var objectCreate;
	var hasRequiredObjectCreate;

	function requireObjectCreate () {
		if (hasRequiredObjectCreate) return objectCreate;
		hasRequiredObjectCreate = 1;
		/* global ActiveXObject -- old IE, WSH */
		var anObject = requireAnObject();
		var definePropertiesModule = requireObjectDefineProperties();
		var enumBugKeys = requireEnumBugKeys();
		var hiddenKeys = requireHiddenKeys();
		var html = requireHtml();
		var documentCreateElement = requireDocumentCreateElement();
		var sharedKey = requireSharedKey();

		var GT = '>';
		var LT = '<';
		var PROTOTYPE = 'prototype';
		var SCRIPT = 'script';
		var IE_PROTO = sharedKey('IE_PROTO');

		var EmptyConstructor = function () { /* empty */ };

		var scriptTag = function (content) {
		  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
		};

		// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
		var NullProtoObjectViaActiveX = function (activeXDocument) {
		  activeXDocument.write(scriptTag(''));
		  activeXDocument.close();
		  var temp = activeXDocument.parentWindow.Object;
		  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
		  activeXDocument = null;
		  return temp;
		};

		// Create object with fake `null` prototype: use iframe Object with cleared prototype
		var NullProtoObjectViaIFrame = function () {
		  // Thrash, waste and sodomy: IE GC bug
		  var iframe = documentCreateElement('iframe');
		  var JS = 'java' + SCRIPT + ':';
		  var iframeDocument;
		  iframe.style.display = 'none';
		  html.appendChild(iframe);
		  // https://github.com/zloirock/core-js/issues/475
		  iframe.src = String(JS);
		  iframeDocument = iframe.contentWindow.document;
		  iframeDocument.open();
		  iframeDocument.write(scriptTag('document.F=Object'));
		  iframeDocument.close();
		  return iframeDocument.F;
		};

		// Check for document.domain and active x support
		// No need to use active x approach when document.domain is not set
		// see https://github.com/es-shims/es5-shim/issues/150
		// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
		// avoid IE GC bug
		var activeXDocument;
		var NullProtoObject = function () {
		  try {
		    activeXDocument = new ActiveXObject('htmlfile');
		  } catch (error) { /* ignore */ }
		  NullProtoObject = typeof document != 'undefined'
		    ? document.domain && activeXDocument
		      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
		      : NullProtoObjectViaIFrame()
		    : NullProtoObjectViaActiveX(activeXDocument); // WSH
		  var length = enumBugKeys.length;
		  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
		  return NullProtoObject();
		};

		hiddenKeys[IE_PROTO] = true;

		// `Object.create` method
		// https://tc39.es/ecma262/#sec-object.create
		// eslint-disable-next-line es/no-object-create -- safe
		objectCreate = Object.create || function create(O, Properties) {
		  var result;
		  if (O !== null) {
		    EmptyConstructor[PROTOTYPE] = anObject(O);
		    result = new EmptyConstructor();
		    EmptyConstructor[PROTOTYPE] = null;
		    // add "__proto__" for Object.getPrototypeOf polyfill
		    result[IE_PROTO] = O;
		  } else result = NullProtoObject();
		  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
		};
		return objectCreate;
	}

	var objectGetOwnPropertyNamesExternal = {};

	var arraySlice;
	var hasRequiredArraySlice;

	function requireArraySlice () {
		if (hasRequiredArraySlice) return arraySlice;
		hasRequiredArraySlice = 1;
		var uncurryThis = requireFunctionUncurryThis();

		arraySlice = uncurryThis([].slice);
		return arraySlice;
	}

	var hasRequiredObjectGetOwnPropertyNamesExternal;

	function requireObjectGetOwnPropertyNamesExternal () {
		if (hasRequiredObjectGetOwnPropertyNamesExternal) return objectGetOwnPropertyNamesExternal;
		hasRequiredObjectGetOwnPropertyNamesExternal = 1;
		/* eslint-disable es/no-object-getownpropertynames -- safe */
		var classof = requireClassofRaw();
		var toIndexedObject = requireToIndexedObject();
		var $getOwnPropertyNames = requireObjectGetOwnPropertyNames().f;
		var arraySlice = requireArraySlice();

		var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
		  ? Object.getOwnPropertyNames(window) : [];

		var getWindowNames = function (it) {
		  try {
		    return $getOwnPropertyNames(it);
		  } catch (error) {
		    return arraySlice(windowNames);
		  }
		};

		// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
		objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames(it) {
		  return windowNames && classof(it) === 'Window'
		    ? getWindowNames(it)
		    : $getOwnPropertyNames(toIndexedObject(it));
		};
		return objectGetOwnPropertyNamesExternal;
	}

	var defineBuiltInAccessor;
	var hasRequiredDefineBuiltInAccessor;

	function requireDefineBuiltInAccessor () {
		if (hasRequiredDefineBuiltInAccessor) return defineBuiltInAccessor;
		hasRequiredDefineBuiltInAccessor = 1;
		var makeBuiltIn = requireMakeBuiltIn();
		var defineProperty = requireObjectDefineProperty();

		defineBuiltInAccessor = function (target, name, descriptor) {
		  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
		  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
		  return defineProperty.f(target, name, descriptor);
		};
		return defineBuiltInAccessor;
	}

	var wellKnownSymbolWrapped = {};

	var hasRequiredWellKnownSymbolWrapped;

	function requireWellKnownSymbolWrapped () {
		if (hasRequiredWellKnownSymbolWrapped) return wellKnownSymbolWrapped;
		hasRequiredWellKnownSymbolWrapped = 1;
		var wellKnownSymbol = requireWellKnownSymbol();

		wellKnownSymbolWrapped.f = wellKnownSymbol;
		return wellKnownSymbolWrapped;
	}

	var path;
	var hasRequiredPath;

	function requirePath () {
		if (hasRequiredPath) return path;
		hasRequiredPath = 1;
		var globalThis = requireGlobalThis();

		path = globalThis;
		return path;
	}

	var wellKnownSymbolDefine;
	var hasRequiredWellKnownSymbolDefine;

	function requireWellKnownSymbolDefine () {
		if (hasRequiredWellKnownSymbolDefine) return wellKnownSymbolDefine;
		hasRequiredWellKnownSymbolDefine = 1;
		var path = requirePath();
		var hasOwn = requireHasOwnProperty();
		var wrappedWellKnownSymbolModule = requireWellKnownSymbolWrapped();
		var defineProperty = requireObjectDefineProperty().f;

		wellKnownSymbolDefine = function (NAME) {
		  var Symbol = path.Symbol || (path.Symbol = {});
		  if (!hasOwn(Symbol, NAME)) defineProperty(Symbol, NAME, {
		    value: wrappedWellKnownSymbolModule.f(NAME)
		  });
		};
		return wellKnownSymbolDefine;
	}

	var symbolDefineToPrimitive;
	var hasRequiredSymbolDefineToPrimitive;

	function requireSymbolDefineToPrimitive () {
		if (hasRequiredSymbolDefineToPrimitive) return symbolDefineToPrimitive;
		hasRequiredSymbolDefineToPrimitive = 1;
		var call = requireFunctionCall();
		var getBuiltIn = requireGetBuiltIn();
		var wellKnownSymbol = requireWellKnownSymbol();
		var defineBuiltIn = requireDefineBuiltIn();

		symbolDefineToPrimitive = function () {
		  var Symbol = getBuiltIn('Symbol');
		  var SymbolPrototype = Symbol && Symbol.prototype;
		  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
		  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

		  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
		    // `Symbol.prototype[@@toPrimitive]` method
		    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
		    // eslint-disable-next-line no-unused-vars -- required for .length
		    defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function (hint) {
		      return call(valueOf, this);
		    }, { arity: 1 });
		  }
		};
		return symbolDefineToPrimitive;
	}

	var setToStringTag;
	var hasRequiredSetToStringTag;

	function requireSetToStringTag () {
		if (hasRequiredSetToStringTag) return setToStringTag;
		hasRequiredSetToStringTag = 1;
		var defineProperty = requireObjectDefineProperty().f;
		var hasOwn = requireHasOwnProperty();
		var wellKnownSymbol = requireWellKnownSymbol();

		var TO_STRING_TAG = wellKnownSymbol('toStringTag');

		setToStringTag = function (target, TAG, STATIC) {
		  if (target && !STATIC) target = target.prototype;
		  if (target && !hasOwn(target, TO_STRING_TAG)) {
		    defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
		  }
		};
		return setToStringTag;
	}

	var functionUncurryThisClause;
	var hasRequiredFunctionUncurryThisClause;

	function requireFunctionUncurryThisClause () {
		if (hasRequiredFunctionUncurryThisClause) return functionUncurryThisClause;
		hasRequiredFunctionUncurryThisClause = 1;
		var classofRaw = requireClassofRaw();
		var uncurryThis = requireFunctionUncurryThis();

		functionUncurryThisClause = function (fn) {
		  // Nashorn bug:
		  //   https://github.com/zloirock/core-js/issues/1128
		  //   https://github.com/zloirock/core-js/issues/1130
		  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
		};
		return functionUncurryThisClause;
	}

	var functionBindContext;
	var hasRequiredFunctionBindContext;

	function requireFunctionBindContext () {
		if (hasRequiredFunctionBindContext) return functionBindContext;
		hasRequiredFunctionBindContext = 1;
		var uncurryThis = requireFunctionUncurryThisClause();
		var aCallable = requireACallable();
		var NATIVE_BIND = requireFunctionBindNative();

		var bind = uncurryThis(uncurryThis.bind);

		// optional / simple context binding
		functionBindContext = function (fn, that) {
		  aCallable(fn);
		  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
		    return fn.apply(that, arguments);
		  };
		};
		return functionBindContext;
	}

	var isArray;
	var hasRequiredIsArray;

	function requireIsArray () {
		if (hasRequiredIsArray) return isArray;
		hasRequiredIsArray = 1;
		var classof = requireClassofRaw();

		// `IsArray` abstract operation
		// https://tc39.es/ecma262/#sec-isarray
		// eslint-disable-next-line es/no-array-isarray -- safe
		isArray = Array.isArray || function isArray(argument) {
		  return classof(argument) === 'Array';
		};
		return isArray;
	}

	var isConstructor;
	var hasRequiredIsConstructor;

	function requireIsConstructor () {
		if (hasRequiredIsConstructor) return isConstructor;
		hasRequiredIsConstructor = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var fails = requireFails();
		var isCallable = requireIsCallable();
		var classof = requireClassof();
		var getBuiltIn = requireGetBuiltIn();
		var inspectSource = requireInspectSource();

		var noop = function () { /* empty */ };
		var construct = getBuiltIn('Reflect', 'construct');
		var constructorRegExp = /^\s*(?:class|function)\b/;
		var exec = uncurryThis(constructorRegExp.exec);
		var INCORRECT_TO_STRING = !constructorRegExp.test(noop);

		var isConstructorModern = function isConstructor(argument) {
		  if (!isCallable(argument)) return false;
		  try {
		    construct(noop, [], argument);
		    return true;
		  } catch (error) {
		    return false;
		  }
		};

		var isConstructorLegacy = function isConstructor(argument) {
		  if (!isCallable(argument)) return false;
		  switch (classof(argument)) {
		    case 'AsyncFunction':
		    case 'GeneratorFunction':
		    case 'AsyncGeneratorFunction': return false;
		  }
		  try {
		    // we can't check .prototype since constructors produced by .bind haven't it
		    // `Function#toString` throws on some built-it function in some legacy engines
		    // (for example, `DOMQuad` and similar in FF41-)
		    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
		  } catch (error) {
		    return true;
		  }
		};

		isConstructorLegacy.sham = true;

		// `IsConstructor` abstract operation
		// https://tc39.es/ecma262/#sec-isconstructor
		isConstructor = !construct || fails(function () {
		  var called;
		  return isConstructorModern(isConstructorModern.call)
		    || !isConstructorModern(Object)
		    || !isConstructorModern(function () { called = true; })
		    || called;
		}) ? isConstructorLegacy : isConstructorModern;
		return isConstructor;
	}

	var arraySpeciesConstructor;
	var hasRequiredArraySpeciesConstructor;

	function requireArraySpeciesConstructor () {
		if (hasRequiredArraySpeciesConstructor) return arraySpeciesConstructor;
		hasRequiredArraySpeciesConstructor = 1;
		var isArray = requireIsArray();
		var isConstructor = requireIsConstructor();
		var isObject = requireIsObject();
		var wellKnownSymbol = requireWellKnownSymbol();

		var SPECIES = wellKnownSymbol('species');
		var $Array = Array;

		// a part of `ArraySpeciesCreate` abstract operation
		// https://tc39.es/ecma262/#sec-arrayspeciescreate
		arraySpeciesConstructor = function (originalArray) {
		  var C;
		  if (isArray(originalArray)) {
		    C = originalArray.constructor;
		    // cross-realm fallback
		    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
		    else if (isObject(C)) {
		      C = C[SPECIES];
		      if (C === null) C = undefined;
		    }
		  } return C === undefined ? $Array : C;
		};
		return arraySpeciesConstructor;
	}

	var arraySpeciesCreate;
	var hasRequiredArraySpeciesCreate;

	function requireArraySpeciesCreate () {
		if (hasRequiredArraySpeciesCreate) return arraySpeciesCreate;
		hasRequiredArraySpeciesCreate = 1;
		var arraySpeciesConstructor = requireArraySpeciesConstructor();

		// `ArraySpeciesCreate` abstract operation
		// https://tc39.es/ecma262/#sec-arrayspeciescreate
		arraySpeciesCreate = function (originalArray, length) {
		  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
		};
		return arraySpeciesCreate;
	}

	var arrayIteration;
	var hasRequiredArrayIteration;

	function requireArrayIteration () {
		if (hasRequiredArrayIteration) return arrayIteration;
		hasRequiredArrayIteration = 1;
		var bind = requireFunctionBindContext();
		var uncurryThis = requireFunctionUncurryThis();
		var IndexedObject = requireIndexedObject();
		var toObject = requireToObject();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var arraySpeciesCreate = requireArraySpeciesCreate();

		var push = uncurryThis([].push);

		// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
		var createMethod = function (TYPE) {
		  var IS_MAP = TYPE === 1;
		  var IS_FILTER = TYPE === 2;
		  var IS_SOME = TYPE === 3;
		  var IS_EVERY = TYPE === 4;
		  var IS_FIND_INDEX = TYPE === 6;
		  var IS_FILTER_REJECT = TYPE === 7;
		  var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
		  return function ($this, callbackfn, that, specificCreate) {
		    var O = toObject($this);
		    var self = IndexedObject(O);
		    var length = lengthOfArrayLike(self);
		    var boundFunction = bind(callbackfn, that);
		    var index = 0;
		    var create = specificCreate || arraySpeciesCreate;
		    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
		    var value, result;
		    for (;length > index; index++) if (NO_HOLES || index in self) {
		      value = self[index];
		      result = boundFunction(value, index, O);
		      if (TYPE) {
		        if (IS_MAP) target[index] = result; // map
		        else if (result) switch (TYPE) {
		          case 3: return true;              // some
		          case 5: return value;             // find
		          case 6: return index;             // findIndex
		          case 2: push(target, value);      // filter
		        } else switch (TYPE) {
		          case 4: return false;             // every
		          case 7: push(target, value);      // filterReject
		        }
		      }
		    }
		    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
		  };
		};

		arrayIteration = {
		  // `Array.prototype.forEach` method
		  // https://tc39.es/ecma262/#sec-array.prototype.foreach
		  forEach: createMethod(0),
		  // `Array.prototype.map` method
		  // https://tc39.es/ecma262/#sec-array.prototype.map
		  map: createMethod(1),
		  // `Array.prototype.filter` method
		  // https://tc39.es/ecma262/#sec-array.prototype.filter
		  filter: createMethod(2),
		  // `Array.prototype.some` method
		  // https://tc39.es/ecma262/#sec-array.prototype.some
		  some: createMethod(3),
		  // `Array.prototype.every` method
		  // https://tc39.es/ecma262/#sec-array.prototype.every
		  every: createMethod(4),
		  // `Array.prototype.find` method
		  // https://tc39.es/ecma262/#sec-array.prototype.find
		  find: createMethod(5),
		  // `Array.prototype.findIndex` method
		  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
		  findIndex: createMethod(6),
		  // `Array.prototype.filterReject` method
		  // https://github.com/tc39/proposal-array-filtering
		  filterReject: createMethod(7)
		};
		return arrayIteration;
	}

	var hasRequiredEs_symbol_constructor;

	function requireEs_symbol_constructor () {
		if (hasRequiredEs_symbol_constructor) return es_symbol_constructor;
		hasRequiredEs_symbol_constructor = 1;
		var $ = require_export();
		var globalThis = requireGlobalThis();
		var call = requireFunctionCall();
		var uncurryThis = requireFunctionUncurryThis();
		var IS_PURE = requireIsPure();
		var DESCRIPTORS = requireDescriptors();
		var NATIVE_SYMBOL = requireSymbolConstructorDetection();
		var fails = requireFails();
		var hasOwn = requireHasOwnProperty();
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var anObject = requireAnObject();
		var toIndexedObject = requireToIndexedObject();
		var toPropertyKey = requireToPropertyKey();
		var $toString = requireToString();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();
		var nativeObjectCreate = requireObjectCreate();
		var objectKeys = requireObjectKeys();
		var getOwnPropertyNamesModule = requireObjectGetOwnPropertyNames();
		var getOwnPropertyNamesExternal = requireObjectGetOwnPropertyNamesExternal();
		var getOwnPropertySymbolsModule = requireObjectGetOwnPropertySymbols();
		var getOwnPropertyDescriptorModule = requireObjectGetOwnPropertyDescriptor();
		var definePropertyModule = requireObjectDefineProperty();
		var definePropertiesModule = requireObjectDefineProperties();
		var propertyIsEnumerableModule = requireObjectPropertyIsEnumerable();
		var defineBuiltIn = requireDefineBuiltIn();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var shared = requireShared();
		var sharedKey = requireSharedKey();
		var hiddenKeys = requireHiddenKeys();
		var uid = requireUid();
		var wellKnownSymbol = requireWellKnownSymbol();
		var wrappedWellKnownSymbolModule = requireWellKnownSymbolWrapped();
		var defineWellKnownSymbol = requireWellKnownSymbolDefine();
		var defineSymbolToPrimitive = requireSymbolDefineToPrimitive();
		var setToStringTag = requireSetToStringTag();
		var InternalStateModule = requireInternalState();
		var $forEach = requireArrayIteration().forEach;

		var HIDDEN = sharedKey('hidden');
		var SYMBOL = 'Symbol';
		var PROTOTYPE = 'prototype';

		var setInternalState = InternalStateModule.set;
		var getInternalState = InternalStateModule.getterFor(SYMBOL);

		var ObjectPrototype = Object[PROTOTYPE];
		var $Symbol = globalThis.Symbol;
		var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
		var RangeError = globalThis.RangeError;
		var TypeError = globalThis.TypeError;
		var QObject = globalThis.QObject;
		var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
		var nativeDefineProperty = definePropertyModule.f;
		var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
		var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
		var push = uncurryThis([].push);

		var AllSymbols = shared('symbols');
		var ObjectPrototypeSymbols = shared('op-symbols');
		var WellKnownSymbolsStore = shared('wks');

		// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
		var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

		// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
		var fallbackDefineProperty = function (O, P, Attributes) {
		  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
		  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
		  nativeDefineProperty(O, P, Attributes);
		  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
		    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
		  }
		};

		var setSymbolDescriptor = DESCRIPTORS && fails(function () {
		  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
		    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
		  })).a !== 7;
		}) ? fallbackDefineProperty : nativeDefineProperty;

		var wrap = function (tag, description) {
		  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype);
		  setInternalState(symbol, {
		    type: SYMBOL,
		    tag: tag,
		    description: description
		  });
		  if (!DESCRIPTORS) symbol.description = description;
		  return symbol;
		};

		var $defineProperty = function defineProperty(O, P, Attributes) {
		  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
		  anObject(O);
		  var key = toPropertyKey(P);
		  anObject(Attributes);
		  if (hasOwn(AllSymbols, key)) {
		    if (!Attributes.enumerable) {
		      if (!hasOwn(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, nativeObjectCreate(null)));
		      O[HIDDEN][key] = true;
		    } else {
		      if (hasOwn(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
		      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
		    } return setSymbolDescriptor(O, key, Attributes);
		  } return nativeDefineProperty(O, key, Attributes);
		};

		var $defineProperties = function defineProperties(O, Properties) {
		  anObject(O);
		  var properties = toIndexedObject(Properties);
		  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
		  $forEach(keys, function (key) {
		    if (!DESCRIPTORS || call($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
		  });
		  return O;
		};

		var $create = function create(O, Properties) {
		  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
		};

		var $propertyIsEnumerable = function propertyIsEnumerable(V) {
		  var P = toPropertyKey(V);
		  var enumerable = call(nativePropertyIsEnumerable, this, P);
		  if (this === ObjectPrototype && hasOwn(AllSymbols, P) && !hasOwn(ObjectPrototypeSymbols, P)) return false;
		  return enumerable || !hasOwn(this, P) || !hasOwn(AllSymbols, P) || hasOwn(this, HIDDEN) && this[HIDDEN][P]
		    ? enumerable : true;
		};

		var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
		  var it = toIndexedObject(O);
		  var key = toPropertyKey(P);
		  if (it === ObjectPrototype && hasOwn(AllSymbols, key) && !hasOwn(ObjectPrototypeSymbols, key)) return;
		  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
		  if (descriptor && hasOwn(AllSymbols, key) && !(hasOwn(it, HIDDEN) && it[HIDDEN][key])) {
		    descriptor.enumerable = true;
		  }
		  return descriptor;
		};

		var $getOwnPropertyNames = function getOwnPropertyNames(O) {
		  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
		  var result = [];
		  $forEach(names, function (key) {
		    if (!hasOwn(AllSymbols, key) && !hasOwn(hiddenKeys, key)) push(result, key);
		  });
		  return result;
		};

		var $getOwnPropertySymbols = function (O) {
		  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
		  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
		  var result = [];
		  $forEach(names, function (key) {
		    if (hasOwn(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn(ObjectPrototype, key))) {
		      push(result, AllSymbols[key]);
		    }
		  });
		  return result;
		};

		// `Symbol` constructor
		// https://tc39.es/ecma262/#sec-symbol-constructor
		if (!NATIVE_SYMBOL) {
		  $Symbol = function Symbol() {
		    if (isPrototypeOf(SymbolPrototype, this)) throw new TypeError('Symbol is not a constructor');
		    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
		    var tag = uid(description);
		    var setter = function (value) {
		      var $this = this === undefined ? globalThis : this;
		      if ($this === ObjectPrototype) call(setter, ObjectPrototypeSymbols, value);
		      if (hasOwn($this, HIDDEN) && hasOwn($this[HIDDEN], tag)) $this[HIDDEN][tag] = false;
		      var descriptor = createPropertyDescriptor(1, value);
		      try {
		        setSymbolDescriptor($this, tag, descriptor);
		      } catch (error) {
		        if (!(error instanceof RangeError)) throw error;
		        fallbackDefineProperty($this, tag, descriptor);
		      }
		    };
		    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
		    return wrap(tag, description);
		  };

		  SymbolPrototype = $Symbol[PROTOTYPE];

		  defineBuiltIn(SymbolPrototype, 'toString', function toString() {
		    return getInternalState(this).tag;
		  });

		  defineBuiltIn($Symbol, 'withoutSetter', function (description) {
		    return wrap(uid(description), description);
		  });

		  propertyIsEnumerableModule.f = $propertyIsEnumerable;
		  definePropertyModule.f = $defineProperty;
		  definePropertiesModule.f = $defineProperties;
		  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
		  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
		  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

		  wrappedWellKnownSymbolModule.f = function (name) {
		    return wrap(wellKnownSymbol(name), name);
		  };

		  if (DESCRIPTORS) {
		    // https://github.com/tc39/proposal-Symbol-description
		    defineBuiltInAccessor(SymbolPrototype, 'description', {
		      configurable: true,
		      get: function description() {
		        return getInternalState(this).description;
		      }
		    });
		    if (!IS_PURE) {
		      defineBuiltIn(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
		    }
		  }
		}

		$({ global: true, constructor: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
		  Symbol: $Symbol
		});

		$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
		  defineWellKnownSymbol(name);
		});

		$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
		  useSetter: function () { USE_SETTER = true; },
		  useSimple: function () { USE_SETTER = false; }
		});

		$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
		  // `Object.create` method
		  // https://tc39.es/ecma262/#sec-object.create
		  create: $create,
		  // `Object.defineProperty` method
		  // https://tc39.es/ecma262/#sec-object.defineproperty
		  defineProperty: $defineProperty,
		  // `Object.defineProperties` method
		  // https://tc39.es/ecma262/#sec-object.defineproperties
		  defineProperties: $defineProperties,
		  // `Object.getOwnPropertyDescriptor` method
		  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
		  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
		});

		$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
		  // `Object.getOwnPropertyNames` method
		  // https://tc39.es/ecma262/#sec-object.getownpropertynames
		  getOwnPropertyNames: $getOwnPropertyNames
		});

		// `Symbol.prototype[@@toPrimitive]` method
		// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
		defineSymbolToPrimitive();

		// `Symbol.prototype[@@toStringTag]` property
		// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
		setToStringTag($Symbol, SYMBOL);

		hiddenKeys[HIDDEN] = true;
		return es_symbol_constructor;
	}

	var es_symbol_for = {};

	var symbolRegistryDetection;
	var hasRequiredSymbolRegistryDetection;

	function requireSymbolRegistryDetection () {
		if (hasRequiredSymbolRegistryDetection) return symbolRegistryDetection;
		hasRequiredSymbolRegistryDetection = 1;
		var NATIVE_SYMBOL = requireSymbolConstructorDetection();

		/* eslint-disable es/no-symbol -- safe */
		symbolRegistryDetection = NATIVE_SYMBOL && !!Symbol['for'] && !!Symbol.keyFor;
		return symbolRegistryDetection;
	}

	var hasRequiredEs_symbol_for;

	function requireEs_symbol_for () {
		if (hasRequiredEs_symbol_for) return es_symbol_for;
		hasRequiredEs_symbol_for = 1;
		var $ = require_export();
		var getBuiltIn = requireGetBuiltIn();
		var hasOwn = requireHasOwnProperty();
		var toString = requireToString();
		var shared = requireShared();
		var NATIVE_SYMBOL_REGISTRY = requireSymbolRegistryDetection();

		var StringToSymbolRegistry = shared('string-to-symbol-registry');
		var SymbolToStringRegistry = shared('symbol-to-string-registry');

		// `Symbol.for` method
		// https://tc39.es/ecma262/#sec-symbol.for
		$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
		  'for': function (key) {
		    var string = toString(key);
		    if (hasOwn(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
		    var symbol = getBuiltIn('Symbol')(string);
		    StringToSymbolRegistry[string] = symbol;
		    SymbolToStringRegistry[symbol] = string;
		    return symbol;
		  }
		});
		return es_symbol_for;
	}

	var es_symbol_keyFor = {};

	var hasRequiredEs_symbol_keyFor;

	function requireEs_symbol_keyFor () {
		if (hasRequiredEs_symbol_keyFor) return es_symbol_keyFor;
		hasRequiredEs_symbol_keyFor = 1;
		var $ = require_export();
		var hasOwn = requireHasOwnProperty();
		var isSymbol = requireIsSymbol();
		var tryToString = requireTryToString();
		var shared = requireShared();
		var NATIVE_SYMBOL_REGISTRY = requireSymbolRegistryDetection();

		var SymbolToStringRegistry = shared('symbol-to-string-registry');

		// `Symbol.keyFor` method
		// https://tc39.es/ecma262/#sec-symbol.keyfor
		$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
		  keyFor: function keyFor(sym) {
		    if (!isSymbol(sym)) throw new TypeError(tryToString(sym) + ' is not a symbol');
		    if (hasOwn(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
		  }
		});
		return es_symbol_keyFor;
	}

	var es_json_stringify = {};

	var functionApply;
	var hasRequiredFunctionApply;

	function requireFunctionApply () {
		if (hasRequiredFunctionApply) return functionApply;
		hasRequiredFunctionApply = 1;
		var NATIVE_BIND = requireFunctionBindNative();

		var FunctionPrototype = Function.prototype;
		var apply = FunctionPrototype.apply;
		var call = FunctionPrototype.call;

		// eslint-disable-next-line es/no-reflect -- safe
		functionApply = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
		  return call.apply(apply, arguments);
		});
		return functionApply;
	}

	var getJsonReplacerFunction;
	var hasRequiredGetJsonReplacerFunction;

	function requireGetJsonReplacerFunction () {
		if (hasRequiredGetJsonReplacerFunction) return getJsonReplacerFunction;
		hasRequiredGetJsonReplacerFunction = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var isArray = requireIsArray();
		var isCallable = requireIsCallable();
		var classof = requireClassofRaw();
		var toString = requireToString();

		var push = uncurryThis([].push);

		getJsonReplacerFunction = function (replacer) {
		  if (isCallable(replacer)) return replacer;
		  if (!isArray(replacer)) return;
		  var rawLength = replacer.length;
		  var keys = [];
		  for (var i = 0; i < rawLength; i++) {
		    var element = replacer[i];
		    if (typeof element == 'string') push(keys, element);
		    else if (typeof element == 'number' || classof(element) === 'Number' || classof(element) === 'String') push(keys, toString(element));
		  }
		  var keysLength = keys.length;
		  var root = true;
		  return function (key, value) {
		    if (root) {
		      root = false;
		      return value;
		    }
		    if (isArray(this)) return value;
		    for (var j = 0; j < keysLength; j++) if (keys[j] === key) return value;
		  };
		};
		return getJsonReplacerFunction;
	}

	var hasRequiredEs_json_stringify;

	function requireEs_json_stringify () {
		if (hasRequiredEs_json_stringify) return es_json_stringify;
		hasRequiredEs_json_stringify = 1;
		var $ = require_export();
		var getBuiltIn = requireGetBuiltIn();
		var apply = requireFunctionApply();
		var call = requireFunctionCall();
		var uncurryThis = requireFunctionUncurryThis();
		var fails = requireFails();
		var isCallable = requireIsCallable();
		var isSymbol = requireIsSymbol();
		var arraySlice = requireArraySlice();
		var getReplacerFunction = requireGetJsonReplacerFunction();
		var NATIVE_SYMBOL = requireSymbolConstructorDetection();

		var $String = String;
		var $stringify = getBuiltIn('JSON', 'stringify');
		var exec = uncurryThis(/./.exec);
		var charAt = uncurryThis(''.charAt);
		var charCodeAt = uncurryThis(''.charCodeAt);
		var replace = uncurryThis(''.replace);
		var numberToString = uncurryThis(1.0.toString);

		var tester = /[\uD800-\uDFFF]/g;
		var low = /^[\uD800-\uDBFF]$/;
		var hi = /^[\uDC00-\uDFFF]$/;

		var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function () {
		  var symbol = getBuiltIn('Symbol')('stringify detection');
		  // MS Edge converts symbol values to JSON as {}
		  return $stringify([symbol]) !== '[null]'
		    // WebKit converts symbol values to JSON as null
		    || $stringify({ a: symbol }) !== '{}'
		    // V8 throws on boxed symbols
		    || $stringify(Object(symbol)) !== '{}';
		});

		// https://github.com/tc39/proposal-well-formed-stringify
		var ILL_FORMED_UNICODE = fails(function () {
		  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
		    || $stringify('\uDEAD') !== '"\\udead"';
		});

		var stringifyWithSymbolsFix = function (it, replacer) {
		  var args = arraySlice(arguments);
		  var $replacer = getReplacerFunction(replacer);
		  if (!isCallable($replacer) && (it === undefined || isSymbol(it))) return; // IE8 returns string on undefined
		  args[1] = function (key, value) {
		    // some old implementations (like WebKit) could pass numbers as keys
		    if (isCallable($replacer)) value = call($replacer, this, $String(key), value);
		    if (!isSymbol(value)) return value;
		  };
		  return apply($stringify, null, args);
		};

		var fixIllFormed = function (match, offset, string) {
		  var prev = charAt(string, offset - 1);
		  var next = charAt(string, offset + 1);
		  if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
		    return '\\u' + numberToString(charCodeAt(match, 0), 16);
		  } return match;
		};

		if ($stringify) {
		  // `JSON.stringify` method
		  // https://tc39.es/ecma262/#sec-json.stringify
		  $({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
		    // eslint-disable-next-line no-unused-vars -- required for `.length`
		    stringify: function stringify(it, replacer, space) {
		      var args = arraySlice(arguments);
		      var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
		      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
		    }
		  });
		}
		return es_json_stringify;
	}

	var es_object_getOwnPropertySymbols = {};

	var hasRequiredEs_object_getOwnPropertySymbols;

	function requireEs_object_getOwnPropertySymbols () {
		if (hasRequiredEs_object_getOwnPropertySymbols) return es_object_getOwnPropertySymbols;
		hasRequiredEs_object_getOwnPropertySymbols = 1;
		var $ = require_export();
		var NATIVE_SYMBOL = requireSymbolConstructorDetection();
		var fails = requireFails();
		var getOwnPropertySymbolsModule = requireObjectGetOwnPropertySymbols();
		var toObject = requireToObject();

		// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
		// https://bugs.chromium.org/p/v8/issues/detail?id=3443
		var FORCED = !NATIVE_SYMBOL || fails(function () { getOwnPropertySymbolsModule.f(1); });

		// `Object.getOwnPropertySymbols` method
		// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
		$({ target: 'Object', stat: true, forced: FORCED }, {
		  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
		    var $getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
		    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
		  }
		});
		return es_object_getOwnPropertySymbols;
	}

	var hasRequiredEs_symbol;

	function requireEs_symbol () {
		if (hasRequiredEs_symbol) return es_symbol;
		hasRequiredEs_symbol = 1;
		// TODO: Remove this module from `core-js@4` since it's split to modules listed below
		requireEs_symbol_constructor();
		requireEs_symbol_for();
		requireEs_symbol_keyFor();
		requireEs_json_stringify();
		requireEs_object_getOwnPropertySymbols();
		return es_symbol;
	}

	requireEs_symbol();

	var es_symbol_description = {};

	var hasRequiredEs_symbol_description;

	function requireEs_symbol_description () {
		if (hasRequiredEs_symbol_description) return es_symbol_description;
		hasRequiredEs_symbol_description = 1;
		var $ = require_export();
		var DESCRIPTORS = requireDescriptors();
		var globalThis = requireGlobalThis();
		var uncurryThis = requireFunctionUncurryThis();
		var hasOwn = requireHasOwnProperty();
		var isCallable = requireIsCallable();
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var toString = requireToString();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var copyConstructorProperties = requireCopyConstructorProperties();

		var NativeSymbol = globalThis.Symbol;
		var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

		if (DESCRIPTORS && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) ||
		  // Safari 12 bug
		  NativeSymbol().description !== undefined
		)) {
		  var EmptyStringDescriptionStore = {};
		  // wrap Symbol constructor for correct work with undefined description
		  var SymbolWrapper = function Symbol() {
		    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString(arguments[0]);
		    var result = isPrototypeOf(SymbolPrototype, this)
		      // eslint-disable-next-line sonarjs/inconsistent-function-call -- ok
		      ? new NativeSymbol(description)
		      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
		      : description === undefined ? NativeSymbol() : NativeSymbol(description);
		    if (description === '') EmptyStringDescriptionStore[result] = true;
		    return result;
		  };

		  copyConstructorProperties(SymbolWrapper, NativeSymbol);
		  SymbolWrapper.prototype = SymbolPrototype;
		  SymbolPrototype.constructor = SymbolWrapper;

		  var NATIVE_SYMBOL = String(NativeSymbol('description detection')) === 'Symbol(description detection)';
		  var thisSymbolValue = uncurryThis(SymbolPrototype.valueOf);
		  var symbolDescriptiveString = uncurryThis(SymbolPrototype.toString);
		  var regexp = /^Symbol\((.*)\)[^)]+$/;
		  var replace = uncurryThis(''.replace);
		  var stringSlice = uncurryThis(''.slice);

		  defineBuiltInAccessor(SymbolPrototype, 'description', {
		    configurable: true,
		    get: function description() {
		      var symbol = thisSymbolValue(this);
		      if (hasOwn(EmptyStringDescriptionStore, symbol)) return '';
		      var string = symbolDescriptiveString(symbol);
		      var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace(string, regexp, '$1');
		      return desc === '' ? undefined : desc;
		    }
		  });

		  $({ global: true, constructor: true, forced: true }, {
		    Symbol: SymbolWrapper
		  });
		}
		return es_symbol_description;
	}

	requireEs_symbol_description();

	var es_symbol_asyncIterator = {};

	var hasRequiredEs_symbol_asyncIterator;

	function requireEs_symbol_asyncIterator () {
		if (hasRequiredEs_symbol_asyncIterator) return es_symbol_asyncIterator;
		hasRequiredEs_symbol_asyncIterator = 1;
		var defineWellKnownSymbol = requireWellKnownSymbolDefine();

		// `Symbol.asyncIterator` well-known symbol
		// https://tc39.es/ecma262/#sec-symbol.asynciterator
		defineWellKnownSymbol('asyncIterator');
		return es_symbol_asyncIterator;
	}

	requireEs_symbol_asyncIterator();

	var es_symbol_iterator = {};

	var hasRequiredEs_symbol_iterator;

	function requireEs_symbol_iterator () {
		if (hasRequiredEs_symbol_iterator) return es_symbol_iterator;
		hasRequiredEs_symbol_iterator = 1;
		var defineWellKnownSymbol = requireWellKnownSymbolDefine();

		// `Symbol.iterator` well-known symbol
		// https://tc39.es/ecma262/#sec-symbol.iterator
		defineWellKnownSymbol('iterator');
		return es_symbol_iterator;
	}

	requireEs_symbol_iterator();

	var es_symbol_toPrimitive = {};

	var hasRequiredEs_symbol_toPrimitive;

	function requireEs_symbol_toPrimitive () {
		if (hasRequiredEs_symbol_toPrimitive) return es_symbol_toPrimitive;
		hasRequiredEs_symbol_toPrimitive = 1;
		var defineWellKnownSymbol = requireWellKnownSymbolDefine();
		var defineSymbolToPrimitive = requireSymbolDefineToPrimitive();

		// `Symbol.toPrimitive` well-known symbol
		// https://tc39.es/ecma262/#sec-symbol.toprimitive
		defineWellKnownSymbol('toPrimitive');

		// `Symbol.prototype[@@toPrimitive]` method
		// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
		defineSymbolToPrimitive();
		return es_symbol_toPrimitive;
	}

	requireEs_symbol_toPrimitive();

	var es_symbol_toStringTag = {};

	var hasRequiredEs_symbol_toStringTag;

	function requireEs_symbol_toStringTag () {
		if (hasRequiredEs_symbol_toStringTag) return es_symbol_toStringTag;
		hasRequiredEs_symbol_toStringTag = 1;
		var getBuiltIn = requireGetBuiltIn();
		var defineWellKnownSymbol = requireWellKnownSymbolDefine();
		var setToStringTag = requireSetToStringTag();

		// `Symbol.toStringTag` well-known symbol
		// https://tc39.es/ecma262/#sec-symbol.tostringtag
		defineWellKnownSymbol('toStringTag');

		// `Symbol.prototype[@@toStringTag]` property
		// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
		setToStringTag(getBuiltIn('Symbol'), 'Symbol');
		return es_symbol_toStringTag;
	}

	requireEs_symbol_toStringTag();

	var es_error_cause = {};

	var functionUncurryThisAccessor;
	var hasRequiredFunctionUncurryThisAccessor;

	function requireFunctionUncurryThisAccessor () {
		if (hasRequiredFunctionUncurryThisAccessor) return functionUncurryThisAccessor;
		hasRequiredFunctionUncurryThisAccessor = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var aCallable = requireACallable();

		functionUncurryThisAccessor = function (object, key, method) {
		  try {
		    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
		  } catch (error) { /* empty */ }
		};
		return functionUncurryThisAccessor;
	}

	var isPossiblePrototype;
	var hasRequiredIsPossiblePrototype;

	function requireIsPossiblePrototype () {
		if (hasRequiredIsPossiblePrototype) return isPossiblePrototype;
		hasRequiredIsPossiblePrototype = 1;
		var isObject = requireIsObject();

		isPossiblePrototype = function (argument) {
		  return isObject(argument) || argument === null;
		};
		return isPossiblePrototype;
	}

	var aPossiblePrototype;
	var hasRequiredAPossiblePrototype;

	function requireAPossiblePrototype () {
		if (hasRequiredAPossiblePrototype) return aPossiblePrototype;
		hasRequiredAPossiblePrototype = 1;
		var isPossiblePrototype = requireIsPossiblePrototype();

		var $String = String;
		var $TypeError = TypeError;

		aPossiblePrototype = function (argument) {
		  if (isPossiblePrototype(argument)) return argument;
		  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
		};
		return aPossiblePrototype;
	}

	var objectSetPrototypeOf;
	var hasRequiredObjectSetPrototypeOf;

	function requireObjectSetPrototypeOf () {
		if (hasRequiredObjectSetPrototypeOf) return objectSetPrototypeOf;
		hasRequiredObjectSetPrototypeOf = 1;
		/* eslint-disable no-proto -- safe */
		var uncurryThisAccessor = requireFunctionUncurryThisAccessor();
		var isObject = requireIsObject();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var aPossiblePrototype = requireAPossiblePrototype();

		// `Object.setPrototypeOf` method
		// https://tc39.es/ecma262/#sec-object.setprototypeof
		// Works with __proto__ only. Old v8 can't work with null proto objects.
		// eslint-disable-next-line es/no-object-setprototypeof -- safe
		objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
		  var CORRECT_SETTER = false;
		  var test = {};
		  var setter;
		  try {
		    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
		    setter(test, []);
		    CORRECT_SETTER = test instanceof Array;
		  } catch (error) { /* empty */ }
		  return function setPrototypeOf(O, proto) {
		    requireObjectCoercible(O);
		    aPossiblePrototype(proto);
		    if (!isObject(O)) return O;
		    if (CORRECT_SETTER) setter(O, proto);
		    else O.__proto__ = proto;
		    return O;
		  };
		}() : undefined);
		return objectSetPrototypeOf;
	}

	var proxyAccessor;
	var hasRequiredProxyAccessor;

	function requireProxyAccessor () {
		if (hasRequiredProxyAccessor) return proxyAccessor;
		hasRequiredProxyAccessor = 1;
		var defineProperty = requireObjectDefineProperty().f;

		proxyAccessor = function (Target, Source, key) {
		  key in Target || defineProperty(Target, key, {
		    configurable: true,
		    get: function () { return Source[key]; },
		    set: function (it) { Source[key] = it; }
		  });
		};
		return proxyAccessor;
	}

	var inheritIfRequired;
	var hasRequiredInheritIfRequired;

	function requireInheritIfRequired () {
		if (hasRequiredInheritIfRequired) return inheritIfRequired;
		hasRequiredInheritIfRequired = 1;
		var isCallable = requireIsCallable();
		var isObject = requireIsObject();
		var setPrototypeOf = requireObjectSetPrototypeOf();

		// makes subclassing work correct for wrapped built-ins
		inheritIfRequired = function ($this, dummy, Wrapper) {
		  var NewTarget, NewTargetPrototype;
		  if (
		    // it can work only with native `setPrototypeOf`
		    setPrototypeOf &&
		    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
		    isCallable(NewTarget = dummy.constructor) &&
		    NewTarget !== Wrapper &&
		    isObject(NewTargetPrototype = NewTarget.prototype) &&
		    NewTargetPrototype !== Wrapper.prototype
		  ) setPrototypeOf($this, NewTargetPrototype);
		  return $this;
		};
		return inheritIfRequired;
	}

	var normalizeStringArgument;
	var hasRequiredNormalizeStringArgument;

	function requireNormalizeStringArgument () {
		if (hasRequiredNormalizeStringArgument) return normalizeStringArgument;
		hasRequiredNormalizeStringArgument = 1;
		var toString = requireToString();

		normalizeStringArgument = function (argument, $default) {
		  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
		};
		return normalizeStringArgument;
	}

	var installErrorCause;
	var hasRequiredInstallErrorCause;

	function requireInstallErrorCause () {
		if (hasRequiredInstallErrorCause) return installErrorCause;
		hasRequiredInstallErrorCause = 1;
		var isObject = requireIsObject();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();

		// `InstallErrorCause` abstract operation
		// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
		installErrorCause = function (O, options) {
		  if (isObject(options) && 'cause' in options) {
		    createNonEnumerableProperty(O, 'cause', options.cause);
		  }
		};
		return installErrorCause;
	}

	var errorStackClear;
	var hasRequiredErrorStackClear;

	function requireErrorStackClear () {
		if (hasRequiredErrorStackClear) return errorStackClear;
		hasRequiredErrorStackClear = 1;
		var uncurryThis = requireFunctionUncurryThis();

		var $Error = Error;
		var replace = uncurryThis(''.replace);

		var TEST = (function (arg) { return String(new $Error(arg).stack); })('zxcasd');
		// eslint-disable-next-line redos/no-vulnerable, sonarjs/slow-regex -- safe
		var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
		var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

		errorStackClear = function (stack, dropEntries) {
		  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
		    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
		  } return stack;
		};
		return errorStackClear;
	}

	var errorStackInstallable;
	var hasRequiredErrorStackInstallable;

	function requireErrorStackInstallable () {
		if (hasRequiredErrorStackInstallable) return errorStackInstallable;
		hasRequiredErrorStackInstallable = 1;
		var fails = requireFails();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();

		errorStackInstallable = !fails(function () {
		  var error = new Error('a');
		  if (!('stack' in error)) return true;
		  // eslint-disable-next-line es/no-object-defineproperty -- safe
		  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
		  return error.stack !== 7;
		});
		return errorStackInstallable;
	}

	var errorStackInstall;
	var hasRequiredErrorStackInstall;

	function requireErrorStackInstall () {
		if (hasRequiredErrorStackInstall) return errorStackInstall;
		hasRequiredErrorStackInstall = 1;
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var clearErrorStack = requireErrorStackClear();
		var ERROR_STACK_INSTALLABLE = requireErrorStackInstallable();

		// non-standard V8
		var captureStackTrace = Error.captureStackTrace;

		errorStackInstall = function (error, C, stack, dropEntries) {
		  if (ERROR_STACK_INSTALLABLE) {
		    if (captureStackTrace) captureStackTrace(error, C);
		    else createNonEnumerableProperty(error, 'stack', clearErrorStack(stack, dropEntries));
		  }
		};
		return errorStackInstall;
	}

	var wrapErrorConstructorWithCause;
	var hasRequiredWrapErrorConstructorWithCause;

	function requireWrapErrorConstructorWithCause () {
		if (hasRequiredWrapErrorConstructorWithCause) return wrapErrorConstructorWithCause;
		hasRequiredWrapErrorConstructorWithCause = 1;
		var getBuiltIn = requireGetBuiltIn();
		var hasOwn = requireHasOwnProperty();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var setPrototypeOf = requireObjectSetPrototypeOf();
		var copyConstructorProperties = requireCopyConstructorProperties();
		var proxyAccessor = requireProxyAccessor();
		var inheritIfRequired = requireInheritIfRequired();
		var normalizeStringArgument = requireNormalizeStringArgument();
		var installErrorCause = requireInstallErrorCause();
		var installErrorStack = requireErrorStackInstall();
		var DESCRIPTORS = requireDescriptors();
		var IS_PURE = requireIsPure();

		wrapErrorConstructorWithCause = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
		  var STACK_TRACE_LIMIT = 'stackTraceLimit';
		  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
		  var path = FULL_NAME.split('.');
		  var ERROR_NAME = path[path.length - 1];
		  var OriginalError = getBuiltIn.apply(null, path);

		  if (!OriginalError) return;

		  var OriginalErrorPrototype = OriginalError.prototype;

		  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
		  if (!IS_PURE && hasOwn(OriginalErrorPrototype, 'cause')) delete OriginalErrorPrototype.cause;

		  if (!FORCED) return OriginalError;

		  var BaseError = getBuiltIn('Error');

		  var WrappedError = wrapper(function (a, b) {
		    var message = normalizeStringArgument(IS_AGGREGATE_ERROR ? b : a, undefined);
		    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
		    if (message !== undefined) createNonEnumerableProperty(result, 'message', message);
		    installErrorStack(result, WrappedError, result.stack, 2);
		    if (this && isPrototypeOf(OriginalErrorPrototype, this)) inheritIfRequired(result, this, WrappedError);
		    if (arguments.length > OPTIONS_POSITION) installErrorCause(result, arguments[OPTIONS_POSITION]);
		    return result;
		  });

		  WrappedError.prototype = OriginalErrorPrototype;

		  if (ERROR_NAME !== 'Error') {
		    if (setPrototypeOf) setPrototypeOf(WrappedError, BaseError);
		    else copyConstructorProperties(WrappedError, BaseError, { name: true });
		  } else if (DESCRIPTORS && STACK_TRACE_LIMIT in OriginalError) {
		    proxyAccessor(WrappedError, OriginalError, STACK_TRACE_LIMIT);
		    proxyAccessor(WrappedError, OriginalError, 'prepareStackTrace');
		  }

		  copyConstructorProperties(WrappedError, OriginalError);

		  if (!IS_PURE) try {
		    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
		    if (OriginalErrorPrototype.name !== ERROR_NAME) {
		      createNonEnumerableProperty(OriginalErrorPrototype, 'name', ERROR_NAME);
		    }
		    OriginalErrorPrototype.constructor = WrappedError;
		  } catch (error) { /* empty */ }

		  return WrappedError;
		};
		return wrapErrorConstructorWithCause;
	}

	var hasRequiredEs_error_cause;

	function requireEs_error_cause () {
		if (hasRequiredEs_error_cause) return es_error_cause;
		hasRequiredEs_error_cause = 1;
		/* eslint-disable no-unused-vars -- required for functions `.length` */
		var $ = require_export();
		var globalThis = requireGlobalThis();
		var apply = requireFunctionApply();
		var wrapErrorConstructorWithCause = requireWrapErrorConstructorWithCause();

		var WEB_ASSEMBLY = 'WebAssembly';
		var WebAssembly = globalThis[WEB_ASSEMBLY];

		// eslint-disable-next-line es/no-error-cause -- feature detection
		var FORCED = new Error('e', { cause: 7 }).cause !== 7;

		var exportGlobalErrorCauseWrapper = function (ERROR_NAME, wrapper) {
		  var O = {};
		  O[ERROR_NAME] = wrapErrorConstructorWithCause(ERROR_NAME, wrapper, FORCED);
		  $({ global: true, constructor: true, arity: 1, forced: FORCED }, O);
		};

		var exportWebAssemblyErrorCauseWrapper = function (ERROR_NAME, wrapper) {
		  if (WebAssembly && WebAssembly[ERROR_NAME]) {
		    var O = {};
		    O[ERROR_NAME] = wrapErrorConstructorWithCause(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED);
		    $({ target: WEB_ASSEMBLY, stat: true, constructor: true, arity: 1, forced: FORCED }, O);
		  }
		};

		// https://tc39.es/ecma262/#sec-nativeerror
		exportGlobalErrorCauseWrapper('Error', function (init) {
		  return function Error(message) { return apply(init, this, arguments); };
		});
		exportGlobalErrorCauseWrapper('EvalError', function (init) {
		  return function EvalError(message) { return apply(init, this, arguments); };
		});
		exportGlobalErrorCauseWrapper('RangeError', function (init) {
		  return function RangeError(message) { return apply(init, this, arguments); };
		});
		exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
		  return function ReferenceError(message) { return apply(init, this, arguments); };
		});
		exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
		  return function SyntaxError(message) { return apply(init, this, arguments); };
		});
		exportGlobalErrorCauseWrapper('TypeError', function (init) {
		  return function TypeError(message) { return apply(init, this, arguments); };
		});
		exportGlobalErrorCauseWrapper('URIError', function (init) {
		  return function URIError(message) { return apply(init, this, arguments); };
		});
		exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
		  return function CompileError(message) { return apply(init, this, arguments); };
		});
		exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
		  return function LinkError(message) { return apply(init, this, arguments); };
		});
		exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
		  return function RuntimeError(message) { return apply(init, this, arguments); };
		});
		return es_error_cause;
	}

	requireEs_error_cause();

	var es_array_concat = {};

	var doesNotExceedSafeInteger;
	var hasRequiredDoesNotExceedSafeInteger;

	function requireDoesNotExceedSafeInteger () {
		if (hasRequiredDoesNotExceedSafeInteger) return doesNotExceedSafeInteger;
		hasRequiredDoesNotExceedSafeInteger = 1;
		var $TypeError = TypeError;
		var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

		doesNotExceedSafeInteger = function (it) {
		  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
		  return it;
		};
		return doesNotExceedSafeInteger;
	}

	var createProperty;
	var hasRequiredCreateProperty;

	function requireCreateProperty () {
		if (hasRequiredCreateProperty) return createProperty;
		hasRequiredCreateProperty = 1;
		var DESCRIPTORS = requireDescriptors();
		var definePropertyModule = requireObjectDefineProperty();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();

		createProperty = function (object, key, value) {
		  if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value));
		  else object[key] = value;
		};
		return createProperty;
	}

	var arrayMethodHasSpeciesSupport;
	var hasRequiredArrayMethodHasSpeciesSupport;

	function requireArrayMethodHasSpeciesSupport () {
		if (hasRequiredArrayMethodHasSpeciesSupport) return arrayMethodHasSpeciesSupport;
		hasRequiredArrayMethodHasSpeciesSupport = 1;
		var fails = requireFails();
		var wellKnownSymbol = requireWellKnownSymbol();
		var V8_VERSION = requireEnvironmentV8Version();

		var SPECIES = wellKnownSymbol('species');

		arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
		  // We can't use this feature detection in V8 since it causes
		  // deoptimization and serious performance degradation
		  // https://github.com/zloirock/core-js/issues/677
		  return V8_VERSION >= 51 || !fails(function () {
		    var array = [];
		    var constructor = array.constructor = {};
		    constructor[SPECIES] = function () {
		      return { foo: 1 };
		    };
		    return array[METHOD_NAME](Boolean).foo !== 1;
		  });
		};
		return arrayMethodHasSpeciesSupport;
	}

	var hasRequiredEs_array_concat;

	function requireEs_array_concat () {
		if (hasRequiredEs_array_concat) return es_array_concat;
		hasRequiredEs_array_concat = 1;
		var $ = require_export();
		var fails = requireFails();
		var isArray = requireIsArray();
		var isObject = requireIsObject();
		var toObject = requireToObject();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var doesNotExceedSafeInteger = requireDoesNotExceedSafeInteger();
		var createProperty = requireCreateProperty();
		var arraySpeciesCreate = requireArraySpeciesCreate();
		var arrayMethodHasSpeciesSupport = requireArrayMethodHasSpeciesSupport();
		var wellKnownSymbol = requireWellKnownSymbol();
		var V8_VERSION = requireEnvironmentV8Version();

		var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');

		// We can't use this feature detection in V8 since it causes
		// deoptimization and serious performance degradation
		// https://github.com/zloirock/core-js/issues/679
		var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
		  var array = [];
		  array[IS_CONCAT_SPREADABLE] = false;
		  return array.concat()[0] !== array;
		});

		var isConcatSpreadable = function (O) {
		  if (!isObject(O)) return false;
		  var spreadable = O[IS_CONCAT_SPREADABLE];
		  return spreadable !== undefined ? !!spreadable : isArray(O);
		};

		var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !arrayMethodHasSpeciesSupport('concat');

		// `Array.prototype.concat` method
		// https://tc39.es/ecma262/#sec-array.prototype.concat
		// with adding support of @@isConcatSpreadable and @@species
		$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
		  // eslint-disable-next-line no-unused-vars -- required for `.length`
		  concat: function concat(arg) {
		    var O = toObject(this);
		    var A = arraySpeciesCreate(O, 0);
		    var n = 0;
		    var i, k, length, len, E;
		    for (i = -1, length = arguments.length; i < length; i++) {
		      E = i === -1 ? O : arguments[i];
		      if (isConcatSpreadable(E)) {
		        len = lengthOfArrayLike(E);
		        doesNotExceedSafeInteger(n + len);
		        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
		      } else {
		        doesNotExceedSafeInteger(n + 1);
		        createProperty(A, n++, E);
		      }
		    }
		    A.length = n;
		    return A;
		  }
		});
		return es_array_concat;
	}

	requireEs_array_concat();

	var es_array_fill = {};

	var arrayFill;
	var hasRequiredArrayFill;

	function requireArrayFill () {
		if (hasRequiredArrayFill) return arrayFill;
		hasRequiredArrayFill = 1;
		var toObject = requireToObject();
		var toAbsoluteIndex = requireToAbsoluteIndex();
		var lengthOfArrayLike = requireLengthOfArrayLike();

		// `Array.prototype.fill` method implementation
		// https://tc39.es/ecma262/#sec-array.prototype.fill
		arrayFill = function fill(value /* , start = 0, end = @length */) {
		  var O = toObject(this);
		  var length = lengthOfArrayLike(O);
		  var argumentsLength = arguments.length;
		  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
		  var end = argumentsLength > 2 ? arguments[2] : undefined;
		  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
		  while (endPos > index) O[index++] = value;
		  return O;
		};
		return arrayFill;
	}

	var addToUnscopables;
	var hasRequiredAddToUnscopables;

	function requireAddToUnscopables () {
		if (hasRequiredAddToUnscopables) return addToUnscopables;
		hasRequiredAddToUnscopables = 1;
		var wellKnownSymbol = requireWellKnownSymbol();
		var create = requireObjectCreate();
		var defineProperty = requireObjectDefineProperty().f;

		var UNSCOPABLES = wellKnownSymbol('unscopables');
		var ArrayPrototype = Array.prototype;

		// Array.prototype[@@unscopables]
		// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
		if (ArrayPrototype[UNSCOPABLES] === undefined) {
		  defineProperty(ArrayPrototype, UNSCOPABLES, {
		    configurable: true,
		    value: create(null)
		  });
		}

		// add a key to Array.prototype[@@unscopables]
		addToUnscopables = function (key) {
		  ArrayPrototype[UNSCOPABLES][key] = true;
		};
		return addToUnscopables;
	}

	var hasRequiredEs_array_fill;

	function requireEs_array_fill () {
		if (hasRequiredEs_array_fill) return es_array_fill;
		hasRequiredEs_array_fill = 1;
		var $ = require_export();
		var fill = requireArrayFill();
		var addToUnscopables = requireAddToUnscopables();

		// `Array.prototype.fill` method
		// https://tc39.es/ecma262/#sec-array.prototype.fill
		$({ target: 'Array', proto: true }, {
		  fill: fill
		});

		// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
		addToUnscopables('fill');
		return es_array_fill;
	}

	requireEs_array_fill();

	var es_array_filter = {};

	var hasRequiredEs_array_filter;

	function requireEs_array_filter () {
		if (hasRequiredEs_array_filter) return es_array_filter;
		hasRequiredEs_array_filter = 1;
		var $ = require_export();
		var $filter = requireArrayIteration().filter;
		var arrayMethodHasSpeciesSupport = requireArrayMethodHasSpeciesSupport();

		var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

		// `Array.prototype.filter` method
		// https://tc39.es/ecma262/#sec-array.prototype.filter
		// with adding support of @@species
		$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
		  filter: function filter(callbackfn /* , thisArg */) {
		    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		  }
		});
		return es_array_filter;
	}

	requireEs_array_filter();

	var es_array_find = {};

	var hasRequiredEs_array_find;

	function requireEs_array_find () {
		if (hasRequiredEs_array_find) return es_array_find;
		hasRequiredEs_array_find = 1;
		var $ = require_export();
		var $find = requireArrayIteration().find;
		var addToUnscopables = requireAddToUnscopables();

		var FIND = 'find';
		var SKIPS_HOLES = true;

		// Shouldn't skip holes
		// eslint-disable-next-line es/no-array-prototype-find -- testing
		if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

		// `Array.prototype.find` method
		// https://tc39.es/ecma262/#sec-array.prototype.find
		$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
		  find: function find(callbackfn /* , that = undefined */) {
		    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		  }
		});

		// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
		addToUnscopables(FIND);
		return es_array_find;
	}

	requireEs_array_find();

	var es_array_findIndex = {};

	var hasRequiredEs_array_findIndex;

	function requireEs_array_findIndex () {
		if (hasRequiredEs_array_findIndex) return es_array_findIndex;
		hasRequiredEs_array_findIndex = 1;
		var $ = require_export();
		var $findIndex = requireArrayIteration().findIndex;
		var addToUnscopables = requireAddToUnscopables();

		var FIND_INDEX = 'findIndex';
		var SKIPS_HOLES = true;

		// Shouldn't skip holes
		// eslint-disable-next-line es/no-array-prototype-findindex -- testing
		if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

		// `Array.prototype.findIndex` method
		// https://tc39.es/ecma262/#sec-array.prototype.findindex
		$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
		  findIndex: function findIndex(callbackfn /* , that = undefined */) {
		    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		  }
		});

		// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
		addToUnscopables(FIND_INDEX);
		return es_array_findIndex;
	}

	requireEs_array_findIndex();

	var es_array_flatMap = {};

	var flattenIntoArray_1;
	var hasRequiredFlattenIntoArray;

	function requireFlattenIntoArray () {
		if (hasRequiredFlattenIntoArray) return flattenIntoArray_1;
		hasRequiredFlattenIntoArray = 1;
		var isArray = requireIsArray();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var doesNotExceedSafeInteger = requireDoesNotExceedSafeInteger();
		var bind = requireFunctionBindContext();

		// `FlattenIntoArray` abstract operation
		// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
		var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
		  var targetIndex = start;
		  var sourceIndex = 0;
		  var mapFn = mapper ? bind(mapper, thisArg) : false;
		  var element, elementLen;

		  while (sourceIndex < sourceLen) {
		    if (sourceIndex in source) {
		      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

		      if (depth > 0 && isArray(element)) {
		        elementLen = lengthOfArrayLike(element);
		        targetIndex = flattenIntoArray(target, original, element, elementLen, targetIndex, depth - 1) - 1;
		      } else {
		        doesNotExceedSafeInteger(targetIndex + 1);
		        target[targetIndex] = element;
		      }

		      targetIndex++;
		    }
		    sourceIndex++;
		  }
		  return targetIndex;
		};

		flattenIntoArray_1 = flattenIntoArray;
		return flattenIntoArray_1;
	}

	var hasRequiredEs_array_flatMap;

	function requireEs_array_flatMap () {
		if (hasRequiredEs_array_flatMap) return es_array_flatMap;
		hasRequiredEs_array_flatMap = 1;
		var $ = require_export();
		var flattenIntoArray = requireFlattenIntoArray();
		var aCallable = requireACallable();
		var toObject = requireToObject();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var arraySpeciesCreate = requireArraySpeciesCreate();

		// `Array.prototype.flatMap` method
		// https://tc39.es/ecma262/#sec-array.prototype.flatmap
		$({ target: 'Array', proto: true }, {
		  flatMap: function flatMap(callbackfn /* , thisArg */) {
		    var O = toObject(this);
		    var sourceLen = lengthOfArrayLike(O);
		    var A;
		    aCallable(callbackfn);
		    A = arraySpeciesCreate(O, 0);
		    A.length = flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		    return A;
		  }
		});
		return es_array_flatMap;
	}

	requireEs_array_flatMap();

	var es_array_from = {};

	var iteratorClose;
	var hasRequiredIteratorClose;

	function requireIteratorClose () {
		if (hasRequiredIteratorClose) return iteratorClose;
		hasRequiredIteratorClose = 1;
		var call = requireFunctionCall();
		var anObject = requireAnObject();
		var getMethod = requireGetMethod();

		iteratorClose = function (iterator, kind, value) {
		  var innerResult, innerError;
		  anObject(iterator);
		  try {
		    innerResult = getMethod(iterator, 'return');
		    if (!innerResult) {
		      if (kind === 'throw') throw value;
		      return value;
		    }
		    innerResult = call(innerResult, iterator);
		  } catch (error) {
		    innerError = true;
		    innerResult = error;
		  }
		  if (kind === 'throw') throw value;
		  if (innerError) throw innerResult;
		  anObject(innerResult);
		  return value;
		};
		return iteratorClose;
	}

	var callWithSafeIterationClosing;
	var hasRequiredCallWithSafeIterationClosing;

	function requireCallWithSafeIterationClosing () {
		if (hasRequiredCallWithSafeIterationClosing) return callWithSafeIterationClosing;
		hasRequiredCallWithSafeIterationClosing = 1;
		var anObject = requireAnObject();
		var iteratorClose = requireIteratorClose();

		// call something on iterator step with safe closing on error
		callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
		  try {
		    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
		  } catch (error) {
		    iteratorClose(iterator, 'throw', error);
		  }
		};
		return callWithSafeIterationClosing;
	}

	var iterators;
	var hasRequiredIterators;

	function requireIterators () {
		if (hasRequiredIterators) return iterators;
		hasRequiredIterators = 1;
		iterators = {};
		return iterators;
	}

	var isArrayIteratorMethod;
	var hasRequiredIsArrayIteratorMethod;

	function requireIsArrayIteratorMethod () {
		if (hasRequiredIsArrayIteratorMethod) return isArrayIteratorMethod;
		hasRequiredIsArrayIteratorMethod = 1;
		var wellKnownSymbol = requireWellKnownSymbol();
		var Iterators = requireIterators();

		var ITERATOR = wellKnownSymbol('iterator');
		var ArrayPrototype = Array.prototype;

		// check on default Array iterator
		isArrayIteratorMethod = function (it) {
		  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
		};
		return isArrayIteratorMethod;
	}

	var getIteratorMethod;
	var hasRequiredGetIteratorMethod;

	function requireGetIteratorMethod () {
		if (hasRequiredGetIteratorMethod) return getIteratorMethod;
		hasRequiredGetIteratorMethod = 1;
		var classof = requireClassof();
		var getMethod = requireGetMethod();
		var isNullOrUndefined = requireIsNullOrUndefined();
		var Iterators = requireIterators();
		var wellKnownSymbol = requireWellKnownSymbol();

		var ITERATOR = wellKnownSymbol('iterator');

		getIteratorMethod = function (it) {
		  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
		    || getMethod(it, '@@iterator')
		    || Iterators[classof(it)];
		};
		return getIteratorMethod;
	}

	var getIterator;
	var hasRequiredGetIterator;

	function requireGetIterator () {
		if (hasRequiredGetIterator) return getIterator;
		hasRequiredGetIterator = 1;
		var call = requireFunctionCall();
		var aCallable = requireACallable();
		var anObject = requireAnObject();
		var tryToString = requireTryToString();
		var getIteratorMethod = requireGetIteratorMethod();

		var $TypeError = TypeError;

		getIterator = function (argument, usingIterator) {
		  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
		  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
		  throw new $TypeError(tryToString(argument) + ' is not iterable');
		};
		return getIterator;
	}

	var arrayFrom;
	var hasRequiredArrayFrom;

	function requireArrayFrom () {
		if (hasRequiredArrayFrom) return arrayFrom;
		hasRequiredArrayFrom = 1;
		var bind = requireFunctionBindContext();
		var call = requireFunctionCall();
		var toObject = requireToObject();
		var callWithSafeIterationClosing = requireCallWithSafeIterationClosing();
		var isArrayIteratorMethod = requireIsArrayIteratorMethod();
		var isConstructor = requireIsConstructor();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var createProperty = requireCreateProperty();
		var getIterator = requireGetIterator();
		var getIteratorMethod = requireGetIteratorMethod();

		var $Array = Array;

		// `Array.from` method implementation
		// https://tc39.es/ecma262/#sec-array.from
		arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
		  var O = toObject(arrayLike);
		  var IS_CONSTRUCTOR = isConstructor(this);
		  var argumentsLength = arguments.length;
		  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
		  var mapping = mapfn !== undefined;
		  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
		  var iteratorMethod = getIteratorMethod(O);
		  var index = 0;
		  var length, result, step, iterator, next, value;
		  // if the target is not iterable or it's an array with the default iterator - use a simple case
		  if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
		    result = IS_CONSTRUCTOR ? new this() : [];
		    iterator = getIterator(O, iteratorMethod);
		    next = iterator.next;
		    for (;!(step = call(next, iterator)).done; index++) {
		      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
		      createProperty(result, index, value);
		    }
		  } else {
		    length = lengthOfArrayLike(O);
		    result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
		    for (;length > index; index++) {
		      value = mapping ? mapfn(O[index], index) : O[index];
		      createProperty(result, index, value);
		    }
		  }
		  result.length = index;
		  return result;
		};
		return arrayFrom;
	}

	var checkCorrectnessOfIteration;
	var hasRequiredCheckCorrectnessOfIteration;

	function requireCheckCorrectnessOfIteration () {
		if (hasRequiredCheckCorrectnessOfIteration) return checkCorrectnessOfIteration;
		hasRequiredCheckCorrectnessOfIteration = 1;
		var wellKnownSymbol = requireWellKnownSymbol();

		var ITERATOR = wellKnownSymbol('iterator');
		var SAFE_CLOSING = false;

		try {
		  var called = 0;
		  var iteratorWithReturn = {
		    next: function () {
		      return { done: !!called++ };
		    },
		    'return': function () {
		      SAFE_CLOSING = true;
		    }
		  };
		  iteratorWithReturn[ITERATOR] = function () {
		    return this;
		  };
		  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
		  Array.from(iteratorWithReturn, function () { throw 2; });
		} catch (error) { /* empty */ }

		checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
		  try {
		    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
		  } catch (error) { return false; } // workaround of old WebKit + `eval` bug
		  var ITERATION_SUPPORT = false;
		  try {
		    var object = {};
		    object[ITERATOR] = function () {
		      return {
		        next: function () {
		          return { done: ITERATION_SUPPORT = true };
		        }
		      };
		    };
		    exec(object);
		  } catch (error) { /* empty */ }
		  return ITERATION_SUPPORT;
		};
		return checkCorrectnessOfIteration;
	}

	var hasRequiredEs_array_from;

	function requireEs_array_from () {
		if (hasRequiredEs_array_from) return es_array_from;
		hasRequiredEs_array_from = 1;
		var $ = require_export();
		var from = requireArrayFrom();
		var checkCorrectnessOfIteration = requireCheckCorrectnessOfIteration();

		var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
		  // eslint-disable-next-line es/no-array-from -- required for testing
		  Array.from(iterable);
		});

		// `Array.from` method
		// https://tc39.es/ecma262/#sec-array.from
		$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
		  from: from
		});
		return es_array_from;
	}

	requireEs_array_from();

	var es_array_includes = {};

	var hasRequiredEs_array_includes;

	function requireEs_array_includes () {
		if (hasRequiredEs_array_includes) return es_array_includes;
		hasRequiredEs_array_includes = 1;
		var $ = require_export();
		var $includes = requireArrayIncludes().includes;
		var fails = requireFails();
		var addToUnscopables = requireAddToUnscopables();

		// FF99+ bug
		var BROKEN_ON_SPARSE = fails(function () {
		  // eslint-disable-next-line es/no-array-prototype-includes -- detection
		  return !Array(1).includes();
		});

		// `Array.prototype.includes` method
		// https://tc39.es/ecma262/#sec-array.prototype.includes
		$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
		  includes: function includes(el /* , fromIndex = 0 */) {
		    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
		  }
		});

		// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
		addToUnscopables('includes');
		return es_array_includes;
	}

	requireEs_array_includes();

	var correctPrototypeGetter;
	var hasRequiredCorrectPrototypeGetter;

	function requireCorrectPrototypeGetter () {
		if (hasRequiredCorrectPrototypeGetter) return correctPrototypeGetter;
		hasRequiredCorrectPrototypeGetter = 1;
		var fails = requireFails();

		correctPrototypeGetter = !fails(function () {
		  function F() { /* empty */ }
		  F.prototype.constructor = null;
		  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
		  return Object.getPrototypeOf(new F()) !== F.prototype;
		});
		return correctPrototypeGetter;
	}

	var objectGetPrototypeOf;
	var hasRequiredObjectGetPrototypeOf;

	function requireObjectGetPrototypeOf () {
		if (hasRequiredObjectGetPrototypeOf) return objectGetPrototypeOf;
		hasRequiredObjectGetPrototypeOf = 1;
		var hasOwn = requireHasOwnProperty();
		var isCallable = requireIsCallable();
		var toObject = requireToObject();
		var sharedKey = requireSharedKey();
		var CORRECT_PROTOTYPE_GETTER = requireCorrectPrototypeGetter();

		var IE_PROTO = sharedKey('IE_PROTO');
		var $Object = Object;
		var ObjectPrototype = $Object.prototype;

		// `Object.getPrototypeOf` method
		// https://tc39.es/ecma262/#sec-object.getprototypeof
		// eslint-disable-next-line es/no-object-getprototypeof -- safe
		objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
		  var object = toObject(O);
		  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
		  var constructor = object.constructor;
		  if (isCallable(constructor) && object instanceof constructor) {
		    return constructor.prototype;
		  } return object instanceof $Object ? ObjectPrototype : null;
		};
		return objectGetPrototypeOf;
	}

	var iteratorsCore;
	var hasRequiredIteratorsCore;

	function requireIteratorsCore () {
		if (hasRequiredIteratorsCore) return iteratorsCore;
		hasRequiredIteratorsCore = 1;
		var fails = requireFails();
		var isCallable = requireIsCallable();
		var isObject = requireIsObject();
		var create = requireObjectCreate();
		var getPrototypeOf = requireObjectGetPrototypeOf();
		var defineBuiltIn = requireDefineBuiltIn();
		var wellKnownSymbol = requireWellKnownSymbol();
		var IS_PURE = requireIsPure();

		var ITERATOR = wellKnownSymbol('iterator');
		var BUGGY_SAFARI_ITERATORS = false;

		// `%IteratorPrototype%` object
		// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
		var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

		/* eslint-disable es/no-array-prototype-keys -- safe */
		if ([].keys) {
		  arrayIterator = [].keys();
		  // Safari 8 has buggy iterators w/o `next`
		  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
		  else {
		    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
		    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
		  }
		}

		var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
		  var test = {};
		  // FF44- legacy iterators case
		  return IteratorPrototype[ITERATOR].call(test) !== test;
		});

		if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
		else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

		// `%IteratorPrototype%[@@iterator]()` method
		// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
		if (!isCallable(IteratorPrototype[ITERATOR])) {
		  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
		    return this;
		  });
		}

		iteratorsCore = {
		  IteratorPrototype: IteratorPrototype,
		  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
		};
		return iteratorsCore;
	}

	var iteratorCreateConstructor;
	var hasRequiredIteratorCreateConstructor;

	function requireIteratorCreateConstructor () {
		if (hasRequiredIteratorCreateConstructor) return iteratorCreateConstructor;
		hasRequiredIteratorCreateConstructor = 1;
		var IteratorPrototype = requireIteratorsCore().IteratorPrototype;
		var create = requireObjectCreate();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();
		var setToStringTag = requireSetToStringTag();
		var Iterators = requireIterators();

		var returnThis = function () { return this; };

		iteratorCreateConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
		  var TO_STRING_TAG = NAME + ' Iterator';
		  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
		  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
		  Iterators[TO_STRING_TAG] = returnThis;
		  return IteratorConstructor;
		};
		return iteratorCreateConstructor;
	}

	var iteratorDefine;
	var hasRequiredIteratorDefine;

	function requireIteratorDefine () {
		if (hasRequiredIteratorDefine) return iteratorDefine;
		hasRequiredIteratorDefine = 1;
		var $ = require_export();
		var call = requireFunctionCall();
		var IS_PURE = requireIsPure();
		var FunctionName = requireFunctionName();
		var isCallable = requireIsCallable();
		var createIteratorConstructor = requireIteratorCreateConstructor();
		var getPrototypeOf = requireObjectGetPrototypeOf();
		var setPrototypeOf = requireObjectSetPrototypeOf();
		var setToStringTag = requireSetToStringTag();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var defineBuiltIn = requireDefineBuiltIn();
		var wellKnownSymbol = requireWellKnownSymbol();
		var Iterators = requireIterators();
		var IteratorsCore = requireIteratorsCore();

		var PROPER_FUNCTION_NAME = FunctionName.PROPER;
		var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
		var IteratorPrototype = IteratorsCore.IteratorPrototype;
		var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
		var ITERATOR = wellKnownSymbol('iterator');
		var KEYS = 'keys';
		var VALUES = 'values';
		var ENTRIES = 'entries';

		var returnThis = function () { return this; };

		iteratorDefine = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
		  createIteratorConstructor(IteratorConstructor, NAME, next);

		  var getIterationMethod = function (KIND) {
		    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
		    if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];

		    switch (KIND) {
		      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
		      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
		      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
		    }

		    return function () { return new IteratorConstructor(this); };
		  };

		  var TO_STRING_TAG = NAME + ' Iterator';
		  var INCORRECT_VALUES_NAME = false;
		  var IterablePrototype = Iterable.prototype;
		  var nativeIterator = IterablePrototype[ITERATOR]
		    || IterablePrototype['@@iterator']
		    || DEFAULT && IterablePrototype[DEFAULT];
		  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
		  var anyNativeIterator = NAME === 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
		  var CurrentIteratorPrototype, methods, KEY;

		  // fix native
		  if (anyNativeIterator) {
		    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
		    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
		      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
		        if (setPrototypeOf) {
		          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
		        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
		          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
		        }
		      }
		      // Set @@toStringTag to native iterators
		      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
		      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
		    }
		  }

		  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
		  if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
		    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
		      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
		    } else {
		      INCORRECT_VALUES_NAME = true;
		      defaultIterator = function values() { return call(nativeIterator, this); };
		    }
		  }

		  // export additional methods
		  if (DEFAULT) {
		    methods = {
		      values: getIterationMethod(VALUES),
		      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
		      entries: getIterationMethod(ENTRIES)
		    };
		    if (FORCED) for (KEY in methods) {
		      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
		        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
		      }
		    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
		  }

		  // define iterator
		  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
		    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
		  }
		  Iterators[NAME] = defaultIterator;

		  return methods;
		};
		return iteratorDefine;
	}

	var createIterResultObject;
	var hasRequiredCreateIterResultObject;

	function requireCreateIterResultObject () {
		if (hasRequiredCreateIterResultObject) return createIterResultObject;
		hasRequiredCreateIterResultObject = 1;
		// `CreateIterResultObject` abstract operation
		// https://tc39.es/ecma262/#sec-createiterresultobject
		createIterResultObject = function (value, done) {
		  return { value: value, done: done };
		};
		return createIterResultObject;
	}

	var es_array_iterator;
	var hasRequiredEs_array_iterator;

	function requireEs_array_iterator () {
		if (hasRequiredEs_array_iterator) return es_array_iterator;
		hasRequiredEs_array_iterator = 1;
		var toIndexedObject = requireToIndexedObject();
		var addToUnscopables = requireAddToUnscopables();
		var Iterators = requireIterators();
		var InternalStateModule = requireInternalState();
		var defineProperty = requireObjectDefineProperty().f;
		var defineIterator = requireIteratorDefine();
		var createIterResultObject = requireCreateIterResultObject();
		var IS_PURE = requireIsPure();
		var DESCRIPTORS = requireDescriptors();

		var ARRAY_ITERATOR = 'Array Iterator';
		var setInternalState = InternalStateModule.set;
		var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

		// `Array.prototype.entries` method
		// https://tc39.es/ecma262/#sec-array.prototype.entries
		// `Array.prototype.keys` method
		// https://tc39.es/ecma262/#sec-array.prototype.keys
		// `Array.prototype.values` method
		// https://tc39.es/ecma262/#sec-array.prototype.values
		// `Array.prototype[@@iterator]` method
		// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
		// `CreateArrayIterator` internal method
		// https://tc39.es/ecma262/#sec-createarrayiterator
		es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
		  setInternalState(this, {
		    type: ARRAY_ITERATOR,
		    target: toIndexedObject(iterated), // target
		    index: 0,                          // next index
		    kind: kind                         // kind
		  });
		// `%ArrayIteratorPrototype%.next` method
		// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
		}, function () {
		  var state = getInternalState(this);
		  var target = state.target;
		  var index = state.index++;
		  if (!target || index >= target.length) {
		    state.target = null;
		    return createIterResultObject(undefined, true);
		  }
		  switch (state.kind) {
		    case 'keys': return createIterResultObject(index, false);
		    case 'values': return createIterResultObject(target[index], false);
		  } return createIterResultObject([index, target[index]], false);
		}, 'values');

		// argumentsList[@@iterator] is %ArrayProto_values%
		// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
		// https://tc39.es/ecma262/#sec-createmappedargumentsobject
		var values = Iterators.Arguments = Iterators.Array;

		// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
		addToUnscopables('keys');
		addToUnscopables('values');
		addToUnscopables('entries');

		// V8 ~ Chrome 45- bug
		if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
		  defineProperty(values, 'name', { value: 'values' });
		} catch (error) { /* empty */ }
		return es_array_iterator;
	}

	requireEs_array_iterator();

	var es_array_join = {};

	var arrayMethodIsStrict;
	var hasRequiredArrayMethodIsStrict;

	function requireArrayMethodIsStrict () {
		if (hasRequiredArrayMethodIsStrict) return arrayMethodIsStrict;
		hasRequiredArrayMethodIsStrict = 1;
		var fails = requireFails();

		arrayMethodIsStrict = function (METHOD_NAME, argument) {
		  var method = [][METHOD_NAME];
		  return !!method && fails(function () {
		    // eslint-disable-next-line no-useless-call -- required for testing
		    method.call(null, argument || function () { return 1; }, 1);
		  });
		};
		return arrayMethodIsStrict;
	}

	var hasRequiredEs_array_join;

	function requireEs_array_join () {
		if (hasRequiredEs_array_join) return es_array_join;
		hasRequiredEs_array_join = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThis();
		var IndexedObject = requireIndexedObject();
		var toIndexedObject = requireToIndexedObject();
		var arrayMethodIsStrict = requireArrayMethodIsStrict();

		var nativeJoin = uncurryThis([].join);

		var ES3_STRINGS = IndexedObject !== Object;
		var FORCED = ES3_STRINGS || !arrayMethodIsStrict('join', ',');

		// `Array.prototype.join` method
		// https://tc39.es/ecma262/#sec-array.prototype.join
		$({ target: 'Array', proto: true, forced: FORCED }, {
		  join: function join(separator) {
		    return nativeJoin(toIndexedObject(this), separator === undefined ? ',' : separator);
		  }
		});
		return es_array_join;
	}

	requireEs_array_join();

	var es_array_map = {};

	var hasRequiredEs_array_map;

	function requireEs_array_map () {
		if (hasRequiredEs_array_map) return es_array_map;
		hasRequiredEs_array_map = 1;
		var $ = require_export();
		var $map = requireArrayIteration().map;
		var arrayMethodHasSpeciesSupport = requireArrayMethodHasSpeciesSupport();

		var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

		// `Array.prototype.map` method
		// https://tc39.es/ecma262/#sec-array.prototype.map
		// with adding support of @@species
		$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
		  map: function map(callbackfn /* , thisArg */) {
		    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		  }
		});
		return es_array_map;
	}

	requireEs_array_map();

	var es_array_push = {};

	var arraySetLength;
	var hasRequiredArraySetLength;

	function requireArraySetLength () {
		if (hasRequiredArraySetLength) return arraySetLength;
		hasRequiredArraySetLength = 1;
		var DESCRIPTORS = requireDescriptors();
		var isArray = requireIsArray();

		var $TypeError = TypeError;
		// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

		// Safari < 13 does not throw an error in this case
		var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
		  // makes no sense without proper strict mode support
		  if (this !== undefined) return true;
		  try {
		    // eslint-disable-next-line es/no-object-defineproperty -- safe
		    Object.defineProperty([], 'length', { writable: false }).length = 1;
		  } catch (error) {
		    return error instanceof TypeError;
		  }
		}();

		arraySetLength = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
		  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
		    throw new $TypeError('Cannot set read only .length');
		  } return O.length = length;
		} : function (O, length) {
		  return O.length = length;
		};
		return arraySetLength;
	}

	var hasRequiredEs_array_push;

	function requireEs_array_push () {
		if (hasRequiredEs_array_push) return es_array_push;
		hasRequiredEs_array_push = 1;
		var $ = require_export();
		var toObject = requireToObject();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var setArrayLength = requireArraySetLength();
		var doesNotExceedSafeInteger = requireDoesNotExceedSafeInteger();
		var fails = requireFails();

		var INCORRECT_TO_LENGTH = fails(function () {
		  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
		});

		// V8 <= 121 and Safari <= 15.4; FF < 23 throws InternalError
		// https://bugs.chromium.org/p/v8/issues/detail?id=12681
		var properErrorOnNonWritableLength = function () {
		  try {
		    // eslint-disable-next-line es/no-object-defineproperty -- safe
		    Object.defineProperty([], 'length', { writable: false }).push();
		  } catch (error) {
		    return error instanceof TypeError;
		  }
		};

		var FORCED = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

		// `Array.prototype.push` method
		// https://tc39.es/ecma262/#sec-array.prototype.push
		$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
		  // eslint-disable-next-line no-unused-vars -- required for `.length`
		  push: function push(item) {
		    var O = toObject(this);
		    var len = lengthOfArrayLike(O);
		    var argCount = arguments.length;
		    doesNotExceedSafeInteger(len + argCount);
		    for (var i = 0; i < argCount; i++) {
		      O[len] = arguments[i];
		      len++;
		    }
		    setArrayLength(O, len);
		    return len;
		  }
		});
		return es_array_push;
	}

	requireEs_array_push();

	var es_array_slice = {};

	var hasRequiredEs_array_slice;

	function requireEs_array_slice () {
		if (hasRequiredEs_array_slice) return es_array_slice;
		hasRequiredEs_array_slice = 1;
		var $ = require_export();
		var isArray = requireIsArray();
		var isConstructor = requireIsConstructor();
		var isObject = requireIsObject();
		var toAbsoluteIndex = requireToAbsoluteIndex();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var toIndexedObject = requireToIndexedObject();
		var createProperty = requireCreateProperty();
		var wellKnownSymbol = requireWellKnownSymbol();
		var arrayMethodHasSpeciesSupport = requireArrayMethodHasSpeciesSupport();
		var nativeSlice = requireArraySlice();

		var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

		var SPECIES = wellKnownSymbol('species');
		var $Array = Array;
		var max = Math.max;

		// `Array.prototype.slice` method
		// https://tc39.es/ecma262/#sec-array.prototype.slice
		// fallback for not array-like ES3 strings and DOM objects
		$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
		  slice: function slice(start, end) {
		    var O = toIndexedObject(this);
		    var length = lengthOfArrayLike(O);
		    var k = toAbsoluteIndex(start, length);
		    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
		    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
		    var Constructor, result, n;
		    if (isArray(O)) {
		      Constructor = O.constructor;
		      // cross-realm fallback
		      if (isConstructor(Constructor) && (Constructor === $Array || isArray(Constructor.prototype))) {
		        Constructor = undefined;
		      } else if (isObject(Constructor)) {
		        Constructor = Constructor[SPECIES];
		        if (Constructor === null) Constructor = undefined;
		      }
		      if (Constructor === $Array || Constructor === undefined) {
		        return nativeSlice(O, k, fin);
		      }
		    }
		    result = new (Constructor === undefined ? $Array : Constructor)(max(fin - k, 0));
		    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
		    result.length = n;
		    return result;
		  }
		});
		return es_array_slice;
	}

	requireEs_array_slice();

	var es_array_sort = {};

	var deletePropertyOrThrow;
	var hasRequiredDeletePropertyOrThrow;

	function requireDeletePropertyOrThrow () {
		if (hasRequiredDeletePropertyOrThrow) return deletePropertyOrThrow;
		hasRequiredDeletePropertyOrThrow = 1;
		var tryToString = requireTryToString();

		var $TypeError = TypeError;

		deletePropertyOrThrow = function (O, P) {
		  if (!delete O[P]) throw new $TypeError('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
		};
		return deletePropertyOrThrow;
	}

	var arraySort;
	var hasRequiredArraySort;

	function requireArraySort () {
		if (hasRequiredArraySort) return arraySort;
		hasRequiredArraySort = 1;
		var arraySlice = requireArraySlice();

		var floor = Math.floor;

		var sort = function (array, comparefn) {
		  var length = array.length;

		  if (length < 8) {
		    // insertion sort
		    var i = 1;
		    var element, j;

		    while (i < length) {
		      j = i;
		      element = array[i];
		      while (j && comparefn(array[j - 1], element) > 0) {
		        array[j] = array[--j];
		      }
		      if (j !== i++) array[j] = element;
		    }
		  } else {
		    // merge sort
		    var middle = floor(length / 2);
		    var left = sort(arraySlice(array, 0, middle), comparefn);
		    var right = sort(arraySlice(array, middle), comparefn);
		    var llength = left.length;
		    var rlength = right.length;
		    var lindex = 0;
		    var rindex = 0;

		    while (lindex < llength || rindex < rlength) {
		      array[lindex + rindex] = (lindex < llength && rindex < rlength)
		        ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
		        : lindex < llength ? left[lindex++] : right[rindex++];
		    }
		  }

		  return array;
		};

		arraySort = sort;
		return arraySort;
	}

	var environmentFfVersion;
	var hasRequiredEnvironmentFfVersion;

	function requireEnvironmentFfVersion () {
		if (hasRequiredEnvironmentFfVersion) return environmentFfVersion;
		hasRequiredEnvironmentFfVersion = 1;
		var userAgent = requireEnvironmentUserAgent();

		var firefox = userAgent.match(/firefox\/(\d+)/i);

		environmentFfVersion = !!firefox && +firefox[1];
		return environmentFfVersion;
	}

	var environmentIsIeOrEdge;
	var hasRequiredEnvironmentIsIeOrEdge;

	function requireEnvironmentIsIeOrEdge () {
		if (hasRequiredEnvironmentIsIeOrEdge) return environmentIsIeOrEdge;
		hasRequiredEnvironmentIsIeOrEdge = 1;
		var UA = requireEnvironmentUserAgent();

		environmentIsIeOrEdge = /MSIE|Trident/.test(UA);
		return environmentIsIeOrEdge;
	}

	var environmentWebkitVersion;
	var hasRequiredEnvironmentWebkitVersion;

	function requireEnvironmentWebkitVersion () {
		if (hasRequiredEnvironmentWebkitVersion) return environmentWebkitVersion;
		hasRequiredEnvironmentWebkitVersion = 1;
		var userAgent = requireEnvironmentUserAgent();

		var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);

		environmentWebkitVersion = !!webkit && +webkit[1];
		return environmentWebkitVersion;
	}

	var hasRequiredEs_array_sort;

	function requireEs_array_sort () {
		if (hasRequiredEs_array_sort) return es_array_sort;
		hasRequiredEs_array_sort = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThis();
		var aCallable = requireACallable();
		var toObject = requireToObject();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var deletePropertyOrThrow = requireDeletePropertyOrThrow();
		var toString = requireToString();
		var fails = requireFails();
		var internalSort = requireArraySort();
		var arrayMethodIsStrict = requireArrayMethodIsStrict();
		var FF = requireEnvironmentFfVersion();
		var IE_OR_EDGE = requireEnvironmentIsIeOrEdge();
		var V8 = requireEnvironmentV8Version();
		var WEBKIT = requireEnvironmentWebkitVersion();

		var test = [];
		var nativeSort = uncurryThis(test.sort);
		var push = uncurryThis(test.push);

		// IE8-
		var FAILS_ON_UNDEFINED = fails(function () {
		  test.sort(undefined);
		});
		// V8 bug
		var FAILS_ON_NULL = fails(function () {
		  test.sort(null);
		});
		// Old WebKit
		var STRICT_METHOD = arrayMethodIsStrict('sort');

		var STABLE_SORT = !fails(function () {
		  // feature detection can be too slow, so check engines versions
		  if (V8) return V8 < 70;
		  if (FF && FF > 3) return;
		  if (IE_OR_EDGE) return true;
		  if (WEBKIT) return WEBKIT < 603;

		  var result = '';
		  var code, chr, value, index;

		  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
		  for (code = 65; code < 76; code++) {
		    chr = String.fromCharCode(code);

		    switch (code) {
		      case 66: case 69: case 70: case 72: value = 3; break;
		      case 68: case 71: value = 4; break;
		      default: value = 2;
		    }

		    for (index = 0; index < 47; index++) {
		      test.push({ k: chr + index, v: value });
		    }
		  }

		  test.sort(function (a, b) { return b.v - a.v; });

		  for (index = 0; index < test.length; index++) {
		    chr = test[index].k.charAt(0);
		    if (result.charAt(result.length - 1) !== chr) result += chr;
		  }

		  return result !== 'DGBEFHACIJK';
		});

		var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT;

		var getSortCompare = function (comparefn) {
		  return function (x, y) {
		    if (y === undefined) return -1;
		    if (x === undefined) return 1;
		    if (comparefn !== undefined) return +comparefn(x, y) || 0;
		    return toString(x) > toString(y) ? 1 : -1;
		  };
		};

		// `Array.prototype.sort` method
		// https://tc39.es/ecma262/#sec-array.prototype.sort
		$({ target: 'Array', proto: true, forced: FORCED }, {
		  sort: function sort(comparefn) {
		    if (comparefn !== undefined) aCallable(comparefn);

		    var array = toObject(this);

		    if (STABLE_SORT) return comparefn === undefined ? nativeSort(array) : nativeSort(array, comparefn);

		    var items = [];
		    var arrayLength = lengthOfArrayLike(array);
		    var itemsLength, index;

		    for (index = 0; index < arrayLength; index++) {
		      if (index in array) push(items, array[index]);
		    }

		    internalSort(items, getSortCompare(comparefn));

		    itemsLength = lengthOfArrayLike(items);
		    index = 0;

		    while (index < itemsLength) array[index] = items[index++];
		    while (index < arrayLength) deletePropertyOrThrow(array, index++);

		    return array;
		  }
		});
		return es_array_sort;
	}

	requireEs_array_sort();

	var es_array_splice = {};

	var hasRequiredEs_array_splice;

	function requireEs_array_splice () {
		if (hasRequiredEs_array_splice) return es_array_splice;
		hasRequiredEs_array_splice = 1;
		var $ = require_export();
		var toObject = requireToObject();
		var toAbsoluteIndex = requireToAbsoluteIndex();
		var toIntegerOrInfinity = requireToIntegerOrInfinity();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var setArrayLength = requireArraySetLength();
		var doesNotExceedSafeInteger = requireDoesNotExceedSafeInteger();
		var arraySpeciesCreate = requireArraySpeciesCreate();
		var createProperty = requireCreateProperty();
		var deletePropertyOrThrow = requireDeletePropertyOrThrow();
		var arrayMethodHasSpeciesSupport = requireArrayMethodHasSpeciesSupport();

		var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

		var max = Math.max;
		var min = Math.min;

		// `Array.prototype.splice` method
		// https://tc39.es/ecma262/#sec-array.prototype.splice
		// with adding support of @@species
		$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
		  splice: function splice(start, deleteCount /* , ...items */) {
		    var O = toObject(this);
		    var len = lengthOfArrayLike(O);
		    var actualStart = toAbsoluteIndex(start, len);
		    var argumentsLength = arguments.length;
		    var insertCount, actualDeleteCount, A, k, from, to;
		    if (argumentsLength === 0) {
		      insertCount = actualDeleteCount = 0;
		    } else if (argumentsLength === 1) {
		      insertCount = 0;
		      actualDeleteCount = len - actualStart;
		    } else {
		      insertCount = argumentsLength - 2;
		      actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
		    }
		    doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
		    A = arraySpeciesCreate(O, actualDeleteCount);
		    for (k = 0; k < actualDeleteCount; k++) {
		      from = actualStart + k;
		      if (from in O) createProperty(A, k, O[from]);
		    }
		    A.length = actualDeleteCount;
		    if (insertCount < actualDeleteCount) {
		      for (k = actualStart; k < len - actualDeleteCount; k++) {
		        from = k + actualDeleteCount;
		        to = k + insertCount;
		        if (from in O) O[to] = O[from];
		        else deletePropertyOrThrow(O, to);
		      }
		      for (k = len; k > len - actualDeleteCount + insertCount; k--) deletePropertyOrThrow(O, k - 1);
		    } else if (insertCount > actualDeleteCount) {
		      for (k = len - actualDeleteCount; k > actualStart; k--) {
		        from = k + actualDeleteCount - 1;
		        to = k + insertCount - 1;
		        if (from in O) O[to] = O[from];
		        else deletePropertyOrThrow(O, to);
		      }
		    }
		    for (k = 0; k < insertCount; k++) {
		      O[k + actualStart] = arguments[k + 2];
		    }
		    setArrayLength(O, len - actualDeleteCount + insertCount);
		    return A;
		  }
		});
		return es_array_splice;
	}

	requireEs_array_splice();

	var es_array_toReversed = {};

	var arrayToReversed;
	var hasRequiredArrayToReversed;

	function requireArrayToReversed () {
		if (hasRequiredArrayToReversed) return arrayToReversed;
		hasRequiredArrayToReversed = 1;
		var lengthOfArrayLike = requireLengthOfArrayLike();

		// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
		// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
		arrayToReversed = function (O, C) {
		  var len = lengthOfArrayLike(O);
		  var A = new C(len);
		  var k = 0;
		  for (; k < len; k++) A[k] = O[len - k - 1];
		  return A;
		};
		return arrayToReversed;
	}

	var hasRequiredEs_array_toReversed;

	function requireEs_array_toReversed () {
		if (hasRequiredEs_array_toReversed) return es_array_toReversed;
		hasRequiredEs_array_toReversed = 1;
		var $ = require_export();
		var arrayToReversed = requireArrayToReversed();
		var toIndexedObject = requireToIndexedObject();
		var addToUnscopables = requireAddToUnscopables();

		var $Array = Array;

		// `Array.prototype.toReversed` method
		// https://tc39.es/ecma262/#sec-array.prototype.toreversed
		$({ target: 'Array', proto: true }, {
		  toReversed: function toReversed() {
		    return arrayToReversed(toIndexedObject(this), $Array);
		  }
		});

		addToUnscopables('toReversed');
		return es_array_toReversed;
	}

	requireEs_array_toReversed();

	var es_array_toSorted = {};

	var arrayFromConstructorAndList;
	var hasRequiredArrayFromConstructorAndList;

	function requireArrayFromConstructorAndList () {
		if (hasRequiredArrayFromConstructorAndList) return arrayFromConstructorAndList;
		hasRequiredArrayFromConstructorAndList = 1;
		var lengthOfArrayLike = requireLengthOfArrayLike();

		arrayFromConstructorAndList = function (Constructor, list, $length) {
		  var index = 0;
		  var length = arguments.length > 2 ? $length : lengthOfArrayLike(list);
		  var result = new Constructor(length);
		  while (length > index) result[index] = list[index++];
		  return result;
		};
		return arrayFromConstructorAndList;
	}

	var getBuiltInPrototypeMethod;
	var hasRequiredGetBuiltInPrototypeMethod;

	function requireGetBuiltInPrototypeMethod () {
		if (hasRequiredGetBuiltInPrototypeMethod) return getBuiltInPrototypeMethod;
		hasRequiredGetBuiltInPrototypeMethod = 1;
		var globalThis = requireGlobalThis();

		getBuiltInPrototypeMethod = function (CONSTRUCTOR, METHOD) {
		  var Constructor = globalThis[CONSTRUCTOR];
		  var Prototype = Constructor && Constructor.prototype;
		  return Prototype && Prototype[METHOD];
		};
		return getBuiltInPrototypeMethod;
	}

	var hasRequiredEs_array_toSorted;

	function requireEs_array_toSorted () {
		if (hasRequiredEs_array_toSorted) return es_array_toSorted;
		hasRequiredEs_array_toSorted = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThis();
		var aCallable = requireACallable();
		var toIndexedObject = requireToIndexedObject();
		var arrayFromConstructorAndList = requireArrayFromConstructorAndList();
		var getBuiltInPrototypeMethod = requireGetBuiltInPrototypeMethod();
		var addToUnscopables = requireAddToUnscopables();

		var $Array = Array;
		var sort = uncurryThis(getBuiltInPrototypeMethod('Array', 'sort'));

		// `Array.prototype.toSorted` method
		// https://tc39.es/ecma262/#sec-array.prototype.tosorted
		$({ target: 'Array', proto: true }, {
		  toSorted: function toSorted(compareFn) {
		    if (compareFn !== undefined) aCallable(compareFn);
		    var O = toIndexedObject(this);
		    var A = arrayFromConstructorAndList($Array, O);
		    return sort(A, compareFn);
		  }
		});

		addToUnscopables('toSorted');
		return es_array_toSorted;
	}

	requireEs_array_toSorted();

	var es_array_toSpliced = {};

	var hasRequiredEs_array_toSpliced;

	function requireEs_array_toSpliced () {
		if (hasRequiredEs_array_toSpliced) return es_array_toSpliced;
		hasRequiredEs_array_toSpliced = 1;
		var $ = require_export();
		var addToUnscopables = requireAddToUnscopables();
		var doesNotExceedSafeInteger = requireDoesNotExceedSafeInteger();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var toAbsoluteIndex = requireToAbsoluteIndex();
		var toIndexedObject = requireToIndexedObject();
		var toIntegerOrInfinity = requireToIntegerOrInfinity();

		var $Array = Array;
		var max = Math.max;
		var min = Math.min;

		// `Array.prototype.toSpliced` method
		// https://tc39.es/ecma262/#sec-array.prototype.tospliced
		$({ target: 'Array', proto: true }, {
		  toSpliced: function toSpliced(start, deleteCount /* , ...items */) {
		    var O = toIndexedObject(this);
		    var len = lengthOfArrayLike(O);
		    var actualStart = toAbsoluteIndex(start, len);
		    var argumentsLength = arguments.length;
		    var k = 0;
		    var insertCount, actualDeleteCount, newLen, A;
		    if (argumentsLength === 0) {
		      insertCount = actualDeleteCount = 0;
		    } else if (argumentsLength === 1) {
		      insertCount = 0;
		      actualDeleteCount = len - actualStart;
		    } else {
		      insertCount = argumentsLength - 2;
		      actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
		    }
		    newLen = doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
		    A = $Array(newLen);

		    for (; k < actualStart; k++) A[k] = O[k];
		    for (; k < actualStart + insertCount; k++) A[k] = arguments[k - actualStart + 2];
		    for (; k < newLen; k++) A[k] = O[k + actualDeleteCount - insertCount];

		    return A;
		  }
		});

		addToUnscopables('toSpliced');
		return es_array_toSpliced;
	}

	requireEs_array_toSpliced();

	var es_array_unscopables_flatMap = {};

	var hasRequiredEs_array_unscopables_flatMap;

	function requireEs_array_unscopables_flatMap () {
		if (hasRequiredEs_array_unscopables_flatMap) return es_array_unscopables_flatMap;
		hasRequiredEs_array_unscopables_flatMap = 1;
		// this method was added to unscopables after implementation
		// in popular engines, so it's moved to a separate module
		var addToUnscopables = requireAddToUnscopables();

		// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
		addToUnscopables('flatMap');
		return es_array_unscopables_flatMap;
	}

	requireEs_array_unscopables_flatMap();

	var es_arrayBuffer_constructor = {};

	var arrayBufferBasicDetection;
	var hasRequiredArrayBufferBasicDetection;

	function requireArrayBufferBasicDetection () {
		if (hasRequiredArrayBufferBasicDetection) return arrayBufferBasicDetection;
		hasRequiredArrayBufferBasicDetection = 1;
		// eslint-disable-next-line es/no-typed-arrays -- safe
		arrayBufferBasicDetection = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';
		return arrayBufferBasicDetection;
	}

	var defineBuiltIns;
	var hasRequiredDefineBuiltIns;

	function requireDefineBuiltIns () {
		if (hasRequiredDefineBuiltIns) return defineBuiltIns;
		hasRequiredDefineBuiltIns = 1;
		var defineBuiltIn = requireDefineBuiltIn();

		defineBuiltIns = function (target, src, options) {
		  for (var key in src) defineBuiltIn(target, key, src[key], options);
		  return target;
		};
		return defineBuiltIns;
	}

	var anInstance;
	var hasRequiredAnInstance;

	function requireAnInstance () {
		if (hasRequiredAnInstance) return anInstance;
		hasRequiredAnInstance = 1;
		var isPrototypeOf = requireObjectIsPrototypeOf();

		var $TypeError = TypeError;

		anInstance = function (it, Prototype) {
		  if (isPrototypeOf(Prototype, it)) return it;
		  throw new $TypeError('Incorrect invocation');
		};
		return anInstance;
	}

	var toIndex;
	var hasRequiredToIndex;

	function requireToIndex () {
		if (hasRequiredToIndex) return toIndex;
		hasRequiredToIndex = 1;
		var toIntegerOrInfinity = requireToIntegerOrInfinity();
		var toLength = requireToLength();

		var $RangeError = RangeError;

		// `ToIndex` abstract operation
		// https://tc39.es/ecma262/#sec-toindex
		toIndex = function (it) {
		  if (it === undefined) return 0;
		  var number = toIntegerOrInfinity(it);
		  var length = toLength(number);
		  if (number !== length) throw new $RangeError('Wrong length or index');
		  return length;
		};
		return toIndex;
	}

	var mathSign;
	var hasRequiredMathSign;

	function requireMathSign () {
		if (hasRequiredMathSign) return mathSign;
		hasRequiredMathSign = 1;
		// `Math.sign` method implementation
		// https://tc39.es/ecma262/#sec-math.sign
		// eslint-disable-next-line es/no-math-sign -- safe
		mathSign = Math.sign || function sign(x) {
		  var n = +x;
		  // eslint-disable-next-line no-self-compare -- NaN check
		  return n === 0 || n !== n ? n : n < 0 ? -1 : 1;
		};
		return mathSign;
	}

	var mathFloatRound;
	var hasRequiredMathFloatRound;

	function requireMathFloatRound () {
		if (hasRequiredMathFloatRound) return mathFloatRound;
		hasRequiredMathFloatRound = 1;
		var sign = requireMathSign();

		var abs = Math.abs;

		var EPSILON = 2.220446049250313e-16; // Number.EPSILON
		var INVERSE_EPSILON = 1 / EPSILON;

		var roundTiesToEven = function (n) {
		  return n + INVERSE_EPSILON - INVERSE_EPSILON;
		};

		mathFloatRound = function (x, FLOAT_EPSILON, FLOAT_MAX_VALUE, FLOAT_MIN_VALUE) {
		  var n = +x;
		  var absolute = abs(n);
		  var s = sign(n);
		  if (absolute < FLOAT_MIN_VALUE) return s * roundTiesToEven(absolute / FLOAT_MIN_VALUE / FLOAT_EPSILON) * FLOAT_MIN_VALUE * FLOAT_EPSILON;
		  var a = (1 + FLOAT_EPSILON / EPSILON) * absolute;
		  var result = a - (a - absolute);
		  // eslint-disable-next-line no-self-compare -- NaN check
		  if (result > FLOAT_MAX_VALUE || result !== result) return s * Infinity;
		  return s * result;
		};
		return mathFloatRound;
	}

	var mathFround;
	var hasRequiredMathFround;

	function requireMathFround () {
		if (hasRequiredMathFround) return mathFround;
		hasRequiredMathFround = 1;
		var floatRound = requireMathFloatRound();

		var FLOAT32_EPSILON = 1.1920928955078125e-7; // 2 ** -23;
		var FLOAT32_MAX_VALUE = 3.4028234663852886e+38; // 2 ** 128 - 2 ** 104
		var FLOAT32_MIN_VALUE = 1.1754943508222875e-38; // 2 ** -126;

		// `Math.fround` method implementation
		// https://tc39.es/ecma262/#sec-math.fround
		// eslint-disable-next-line es/no-math-fround -- safe
		mathFround = Math.fround || function fround(x) {
		  return floatRound(x, FLOAT32_EPSILON, FLOAT32_MAX_VALUE, FLOAT32_MIN_VALUE);
		};
		return mathFround;
	}

	var ieee754;
	var hasRequiredIeee754;

	function requireIeee754 () {
		if (hasRequiredIeee754) return ieee754;
		hasRequiredIeee754 = 1;
		// IEEE754 conversions based on https://github.com/feross/ieee754
		var $Array = Array;
		var abs = Math.abs;
		var pow = Math.pow;
		var floor = Math.floor;
		var log = Math.log;
		var LN2 = Math.LN2;

		var pack = function (number, mantissaLength, bytes) {
		  var buffer = $Array(bytes);
		  var exponentLength = bytes * 8 - mantissaLength - 1;
		  var eMax = (1 << exponentLength) - 1;
		  var eBias = eMax >> 1;
		  var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
		  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
		  var index = 0;
		  var exponent, mantissa, c;
		  number = abs(number);
		  // eslint-disable-next-line no-self-compare -- NaN check
		  if (number !== number || number === Infinity) {
		    // eslint-disable-next-line no-self-compare -- NaN check
		    mantissa = number !== number ? 1 : 0;
		    exponent = eMax;
		  } else {
		    exponent = floor(log(number) / LN2);
		    c = pow(2, -exponent);
		    if (number * c < 1) {
		      exponent--;
		      c *= 2;
		    }
		    if (exponent + eBias >= 1) {
		      number += rt / c;
		    } else {
		      number += rt * pow(2, 1 - eBias);
		    }
		    if (number * c >= 2) {
		      exponent++;
		      c /= 2;
		    }
		    if (exponent + eBias >= eMax) {
		      mantissa = 0;
		      exponent = eMax;
		    } else if (exponent + eBias >= 1) {
		      mantissa = (number * c - 1) * pow(2, mantissaLength);
		      exponent += eBias;
		    } else {
		      mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
		      exponent = 0;
		    }
		  }
		  while (mantissaLength >= 8) {
		    buffer[index++] = mantissa & 255;
		    mantissa /= 256;
		    mantissaLength -= 8;
		  }
		  exponent = exponent << mantissaLength | mantissa;
		  exponentLength += mantissaLength;
		  while (exponentLength > 0) {
		    buffer[index++] = exponent & 255;
		    exponent /= 256;
		    exponentLength -= 8;
		  }
		  buffer[index - 1] |= sign * 128;
		  return buffer;
		};

		var unpack = function (buffer, mantissaLength) {
		  var bytes = buffer.length;
		  var exponentLength = bytes * 8 - mantissaLength - 1;
		  var eMax = (1 << exponentLength) - 1;
		  var eBias = eMax >> 1;
		  var nBits = exponentLength - 7;
		  var index = bytes - 1;
		  var sign = buffer[index--];
		  var exponent = sign & 127;
		  var mantissa;
		  sign >>= 7;
		  while (nBits > 0) {
		    exponent = exponent * 256 + buffer[index--];
		    nBits -= 8;
		  }
		  mantissa = exponent & (1 << -nBits) - 1;
		  exponent >>= -nBits;
		  nBits += mantissaLength;
		  while (nBits > 0) {
		    mantissa = mantissa * 256 + buffer[index--];
		    nBits -= 8;
		  }
		  if (exponent === 0) {
		    exponent = 1 - eBias;
		  } else if (exponent === eMax) {
		    return mantissa ? NaN : sign ? -Infinity : Infinity;
		  } else {
		    mantissa += pow(2, mantissaLength);
		    exponent -= eBias;
		  } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
		};

		ieee754 = {
		  pack: pack,
		  unpack: unpack
		};
		return ieee754;
	}

	var arrayBuffer;
	var hasRequiredArrayBuffer;

	function requireArrayBuffer () {
		if (hasRequiredArrayBuffer) return arrayBuffer;
		hasRequiredArrayBuffer = 1;
		var globalThis = requireGlobalThis();
		var uncurryThis = requireFunctionUncurryThis();
		var DESCRIPTORS = requireDescriptors();
		var NATIVE_ARRAY_BUFFER = requireArrayBufferBasicDetection();
		var FunctionName = requireFunctionName();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var defineBuiltIns = requireDefineBuiltIns();
		var fails = requireFails();
		var anInstance = requireAnInstance();
		var toIntegerOrInfinity = requireToIntegerOrInfinity();
		var toLength = requireToLength();
		var toIndex = requireToIndex();
		var fround = requireMathFround();
		var IEEE754 = requireIeee754();
		var getPrototypeOf = requireObjectGetPrototypeOf();
		var setPrototypeOf = requireObjectSetPrototypeOf();
		var arrayFill = requireArrayFill();
		var arraySlice = requireArraySlice();
		var inheritIfRequired = requireInheritIfRequired();
		var copyConstructorProperties = requireCopyConstructorProperties();
		var setToStringTag = requireSetToStringTag();
		var InternalStateModule = requireInternalState();

		var PROPER_FUNCTION_NAME = FunctionName.PROPER;
		var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
		var ARRAY_BUFFER = 'ArrayBuffer';
		var DATA_VIEW = 'DataView';
		var PROTOTYPE = 'prototype';
		var WRONG_LENGTH = 'Wrong length';
		var WRONG_INDEX = 'Wrong index';
		var getInternalArrayBufferState = InternalStateModule.getterFor(ARRAY_BUFFER);
		var getInternalDataViewState = InternalStateModule.getterFor(DATA_VIEW);
		var setInternalState = InternalStateModule.set;
		var NativeArrayBuffer = globalThis[ARRAY_BUFFER];
		var $ArrayBuffer = NativeArrayBuffer;
		var ArrayBufferPrototype = $ArrayBuffer && $ArrayBuffer[PROTOTYPE];
		var $DataView = globalThis[DATA_VIEW];
		var DataViewPrototype = $DataView && $DataView[PROTOTYPE];
		var ObjectPrototype = Object.prototype;
		var Array = globalThis.Array;
		var RangeError = globalThis.RangeError;
		var fill = uncurryThis(arrayFill);
		var reverse = uncurryThis([].reverse);

		var packIEEE754 = IEEE754.pack;
		var unpackIEEE754 = IEEE754.unpack;

		var packInt8 = function (number) {
		  return [number & 0xFF];
		};

		var packInt16 = function (number) {
		  return [number & 0xFF, number >> 8 & 0xFF];
		};

		var packInt32 = function (number) {
		  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
		};

		var unpackInt32 = function (buffer) {
		  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
		};

		var packFloat32 = function (number) {
		  return packIEEE754(fround(number), 23, 4);
		};

		var packFloat64 = function (number) {
		  return packIEEE754(number, 52, 8);
		};

		var addGetter = function (Constructor, key, getInternalState) {
		  defineBuiltInAccessor(Constructor[PROTOTYPE], key, {
		    configurable: true,
		    get: function () {
		      return getInternalState(this)[key];
		    }
		  });
		};

		var get = function (view, count, index, isLittleEndian) {
		  var store = getInternalDataViewState(view);
		  var intIndex = toIndex(index);
		  var boolIsLittleEndian = !!isLittleEndian;
		  if (intIndex + count > store.byteLength) throw new RangeError(WRONG_INDEX);
		  var bytes = store.bytes;
		  var start = intIndex + store.byteOffset;
		  var pack = arraySlice(bytes, start, start + count);
		  return boolIsLittleEndian ? pack : reverse(pack);
		};

		var set = function (view, count, index, conversion, value, isLittleEndian) {
		  var store = getInternalDataViewState(view);
		  var intIndex = toIndex(index);
		  var pack = conversion(+value);
		  var boolIsLittleEndian = !!isLittleEndian;
		  if (intIndex + count > store.byteLength) throw new RangeError(WRONG_INDEX);
		  var bytes = store.bytes;
		  var start = intIndex + store.byteOffset;
		  for (var i = 0; i < count; i++) bytes[start + i] = pack[boolIsLittleEndian ? i : count - i - 1];
		};

		if (!NATIVE_ARRAY_BUFFER) {
		  $ArrayBuffer = function ArrayBuffer(length) {
		    anInstance(this, ArrayBufferPrototype);
		    var byteLength = toIndex(length);
		    setInternalState(this, {
		      type: ARRAY_BUFFER,
		      bytes: fill(Array(byteLength), 0),
		      byteLength: byteLength
		    });
		    if (!DESCRIPTORS) {
		      this.byteLength = byteLength;
		      this.detached = false;
		    }
		  };

		  ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE];

		  $DataView = function DataView(buffer, byteOffset, byteLength) {
		    anInstance(this, DataViewPrototype);
		    anInstance(buffer, ArrayBufferPrototype);
		    var bufferState = getInternalArrayBufferState(buffer);
		    var bufferLength = bufferState.byteLength;
		    var offset = toIntegerOrInfinity(byteOffset);
		    if (offset < 0 || offset > bufferLength) throw new RangeError('Wrong offset');
		    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
		    if (offset + byteLength > bufferLength) throw new RangeError(WRONG_LENGTH);
		    setInternalState(this, {
		      type: DATA_VIEW,
		      buffer: buffer,
		      byteLength: byteLength,
		      byteOffset: offset,
		      bytes: bufferState.bytes
		    });
		    if (!DESCRIPTORS) {
		      this.buffer = buffer;
		      this.byteLength = byteLength;
		      this.byteOffset = offset;
		    }
		  };

		  DataViewPrototype = $DataView[PROTOTYPE];

		  if (DESCRIPTORS) {
		    addGetter($ArrayBuffer, 'byteLength', getInternalArrayBufferState);
		    addGetter($DataView, 'buffer', getInternalDataViewState);
		    addGetter($DataView, 'byteLength', getInternalDataViewState);
		    addGetter($DataView, 'byteOffset', getInternalDataViewState);
		  }

		  defineBuiltIns(DataViewPrototype, {
		    getInt8: function getInt8(byteOffset) {
		      return get(this, 1, byteOffset)[0] << 24 >> 24;
		    },
		    getUint8: function getUint8(byteOffset) {
		      return get(this, 1, byteOffset)[0];
		    },
		    getInt16: function getInt16(byteOffset /* , littleEndian */) {
		      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : false);
		      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
		    },
		    getUint16: function getUint16(byteOffset /* , littleEndian */) {
		      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : false);
		      return bytes[1] << 8 | bytes[0];
		    },
		    getInt32: function getInt32(byteOffset /* , littleEndian */) {
		      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : false));
		    },
		    getUint32: function getUint32(byteOffset /* , littleEndian */) {
		      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : false)) >>> 0;
		    },
		    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
		      return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : false), 23);
		    },
		    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
		      return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : false), 52);
		    },
		    setInt8: function setInt8(byteOffset, value) {
		      set(this, 1, byteOffset, packInt8, value);
		    },
		    setUint8: function setUint8(byteOffset, value) {
		      set(this, 1, byteOffset, packInt8, value);
		    },
		    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
		      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : false);
		    },
		    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
		      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : false);
		    },
		    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
		      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : false);
		    },
		    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
		      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : false);
		    },
		    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
		      set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : false);
		    },
		    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
		      set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : false);
		    }
		  });
		} else {
		  var INCORRECT_ARRAY_BUFFER_NAME = PROPER_FUNCTION_NAME && NativeArrayBuffer.name !== ARRAY_BUFFER;
		  /* eslint-disable no-new, sonarjs/inconsistent-function-call -- required for testing */
		  if (!fails(function () {
		    NativeArrayBuffer(1);
		  }) || !fails(function () {
		    new NativeArrayBuffer(-1);
		  }) || fails(function () {
		    new NativeArrayBuffer();
		    new NativeArrayBuffer(1.5);
		    new NativeArrayBuffer(NaN);
		    return NativeArrayBuffer.length !== 1 || INCORRECT_ARRAY_BUFFER_NAME && !CONFIGURABLE_FUNCTION_NAME;
		  })) {
		    /* eslint-enable no-new, sonarjs/inconsistent-function-call -- required for testing */
		    $ArrayBuffer = function ArrayBuffer(length) {
		      anInstance(this, ArrayBufferPrototype);
		      return inheritIfRequired(new NativeArrayBuffer(toIndex(length)), this, $ArrayBuffer);
		    };

		    $ArrayBuffer[PROTOTYPE] = ArrayBufferPrototype;

		    ArrayBufferPrototype.constructor = $ArrayBuffer;

		    copyConstructorProperties($ArrayBuffer, NativeArrayBuffer);
		  } else if (INCORRECT_ARRAY_BUFFER_NAME && CONFIGURABLE_FUNCTION_NAME) {
		    createNonEnumerableProperty(NativeArrayBuffer, 'name', ARRAY_BUFFER);
		  }

		  // WebKit bug - the same parent prototype for typed arrays and data view
		  if (setPrototypeOf && getPrototypeOf(DataViewPrototype) !== ObjectPrototype) {
		    setPrototypeOf(DataViewPrototype, ObjectPrototype);
		  }

		  // iOS Safari 7.x bug
		  var testView = new $DataView(new $ArrayBuffer(2));
		  var $setInt8 = uncurryThis(DataViewPrototype.setInt8);
		  testView.setInt8(0, 2147483648);
		  testView.setInt8(1, 2147483649);
		  if (testView.getInt8(0) || !testView.getInt8(1)) defineBuiltIns(DataViewPrototype, {
		    setInt8: function setInt8(byteOffset, value) {
		      $setInt8(this, byteOffset, value << 24 >> 24);
		    },
		    setUint8: function setUint8(byteOffset, value) {
		      $setInt8(this, byteOffset, value << 24 >> 24);
		    }
		  }, { unsafe: true });
		}

		setToStringTag($ArrayBuffer, ARRAY_BUFFER);
		setToStringTag($DataView, DATA_VIEW);

		arrayBuffer = {
		  ArrayBuffer: $ArrayBuffer,
		  DataView: $DataView
		};
		return arrayBuffer;
	}

	var setSpecies;
	var hasRequiredSetSpecies;

	function requireSetSpecies () {
		if (hasRequiredSetSpecies) return setSpecies;
		hasRequiredSetSpecies = 1;
		var getBuiltIn = requireGetBuiltIn();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var wellKnownSymbol = requireWellKnownSymbol();
		var DESCRIPTORS = requireDescriptors();

		var SPECIES = wellKnownSymbol('species');

		setSpecies = function (CONSTRUCTOR_NAME) {
		  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);

		  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
		    defineBuiltInAccessor(Constructor, SPECIES, {
		      configurable: true,
		      get: function () { return this; }
		    });
		  }
		};
		return setSpecies;
	}

	var hasRequiredEs_arrayBuffer_constructor;

	function requireEs_arrayBuffer_constructor () {
		if (hasRequiredEs_arrayBuffer_constructor) return es_arrayBuffer_constructor;
		hasRequiredEs_arrayBuffer_constructor = 1;
		var $ = require_export();
		var globalThis = requireGlobalThis();
		var arrayBufferModule = requireArrayBuffer();
		var setSpecies = requireSetSpecies();

		var ARRAY_BUFFER = 'ArrayBuffer';
		var ArrayBuffer = arrayBufferModule[ARRAY_BUFFER];
		var NativeArrayBuffer = globalThis[ARRAY_BUFFER];

		// `ArrayBuffer` constructor
		// https://tc39.es/ecma262/#sec-arraybuffer-constructor
		$({ global: true, constructor: true, forced: NativeArrayBuffer !== ArrayBuffer }, {
		  ArrayBuffer: ArrayBuffer
		});

		setSpecies(ARRAY_BUFFER);
		return es_arrayBuffer_constructor;
	}

	requireEs_arrayBuffer_constructor();

	var es_arrayBuffer_detached = {};

	var arrayBufferByteLength;
	var hasRequiredArrayBufferByteLength;

	function requireArrayBufferByteLength () {
		if (hasRequiredArrayBufferByteLength) return arrayBufferByteLength;
		hasRequiredArrayBufferByteLength = 1;
		var globalThis = requireGlobalThis();
		var uncurryThisAccessor = requireFunctionUncurryThisAccessor();
		var classof = requireClassofRaw();

		var ArrayBuffer = globalThis.ArrayBuffer;
		var TypeError = globalThis.TypeError;

		// Includes
		// - Perform ? RequireInternalSlot(O, [[ArrayBufferData]]).
		// - If IsSharedArrayBuffer(O) is true, throw a TypeError exception.
		arrayBufferByteLength = ArrayBuffer && uncurryThisAccessor(ArrayBuffer.prototype, 'byteLength', 'get') || function (O) {
		  if (classof(O) !== 'ArrayBuffer') throw new TypeError('ArrayBuffer expected');
		  return O.byteLength;
		};
		return arrayBufferByteLength;
	}

	var arrayBufferIsDetached;
	var hasRequiredArrayBufferIsDetached;

	function requireArrayBufferIsDetached () {
		if (hasRequiredArrayBufferIsDetached) return arrayBufferIsDetached;
		hasRequiredArrayBufferIsDetached = 1;
		var globalThis = requireGlobalThis();
		var uncurryThis = requireFunctionUncurryThisClause();
		var arrayBufferByteLength = requireArrayBufferByteLength();

		var ArrayBuffer = globalThis.ArrayBuffer;
		var ArrayBufferPrototype = ArrayBuffer && ArrayBuffer.prototype;
		var slice = ArrayBufferPrototype && uncurryThis(ArrayBufferPrototype.slice);

		arrayBufferIsDetached = function (O) {
		  if (arrayBufferByteLength(O) !== 0) return false;
		  if (!slice) return false;
		  try {
		    slice(O, 0, 0);
		    return false;
		  } catch (error) {
		    return true;
		  }
		};
		return arrayBufferIsDetached;
	}

	var hasRequiredEs_arrayBuffer_detached;

	function requireEs_arrayBuffer_detached () {
		if (hasRequiredEs_arrayBuffer_detached) return es_arrayBuffer_detached;
		hasRequiredEs_arrayBuffer_detached = 1;
		var DESCRIPTORS = requireDescriptors();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var isDetached = requireArrayBufferIsDetached();

		var ArrayBufferPrototype = ArrayBuffer.prototype;

		// `ArrayBuffer.prototype.detached` getter
		// https://tc39.es/ecma262/#sec-get-arraybuffer.prototype.detached
		if (DESCRIPTORS && !('detached' in ArrayBufferPrototype)) {
		  defineBuiltInAccessor(ArrayBufferPrototype, 'detached', {
		    configurable: true,
		    get: function detached() {
		      return isDetached(this);
		    }
		  });
		}
		return es_arrayBuffer_detached;
	}

	requireEs_arrayBuffer_detached();

	var es_arrayBuffer_transfer = {};

	var arrayBufferNotDetached;
	var hasRequiredArrayBufferNotDetached;

	function requireArrayBufferNotDetached () {
		if (hasRequiredArrayBufferNotDetached) return arrayBufferNotDetached;
		hasRequiredArrayBufferNotDetached = 1;
		var isDetached = requireArrayBufferIsDetached();

		var $TypeError = TypeError;

		arrayBufferNotDetached = function (it) {
		  if (isDetached(it)) throw new $TypeError('ArrayBuffer is detached');
		  return it;
		};
		return arrayBufferNotDetached;
	}

	var environment;
	var hasRequiredEnvironment;

	function requireEnvironment () {
		if (hasRequiredEnvironment) return environment;
		hasRequiredEnvironment = 1;
		/* global Bun, Deno -- detection */
		var globalThis = requireGlobalThis();
		var userAgent = requireEnvironmentUserAgent();
		var classof = requireClassofRaw();

		var userAgentStartsWith = function (string) {
		  return userAgent.slice(0, string.length) === string;
		};

		environment = (function () {
		  if (userAgentStartsWith('Bun/')) return 'BUN';
		  if (userAgentStartsWith('Cloudflare-Workers')) return 'CLOUDFLARE';
		  if (userAgentStartsWith('Deno/')) return 'DENO';
		  if (userAgentStartsWith('Node.js/')) return 'NODE';
		  if (globalThis.Bun && typeof Bun.version == 'string') return 'BUN';
		  if (globalThis.Deno && typeof Deno.version == 'object') return 'DENO';
		  if (classof(globalThis.process) === 'process') return 'NODE';
		  if (globalThis.window && globalThis.document) return 'BROWSER';
		  return 'REST';
		})();
		return environment;
	}

	var environmentIsNode;
	var hasRequiredEnvironmentIsNode;

	function requireEnvironmentIsNode () {
		if (hasRequiredEnvironmentIsNode) return environmentIsNode;
		hasRequiredEnvironmentIsNode = 1;
		var ENVIRONMENT = requireEnvironment();

		environmentIsNode = ENVIRONMENT === 'NODE';
		return environmentIsNode;
	}

	var getBuiltInNodeModule;
	var hasRequiredGetBuiltInNodeModule;

	function requireGetBuiltInNodeModule () {
		if (hasRequiredGetBuiltInNodeModule) return getBuiltInNodeModule;
		hasRequiredGetBuiltInNodeModule = 1;
		var globalThis = requireGlobalThis();
		var IS_NODE = requireEnvironmentIsNode();

		getBuiltInNodeModule = function (name) {
		  if (IS_NODE) {
		    try {
		      return globalThis.process.getBuiltinModule(name);
		    } catch (error) { /* empty */ }
		    try {
		      // eslint-disable-next-line no-new-func -- safe
		      return Function('return require("' + name + '")')();
		    } catch (error) { /* empty */ }
		  }
		};
		return getBuiltInNodeModule;
	}

	var structuredCloneProperTransfer;
	var hasRequiredStructuredCloneProperTransfer;

	function requireStructuredCloneProperTransfer () {
		if (hasRequiredStructuredCloneProperTransfer) return structuredCloneProperTransfer;
		hasRequiredStructuredCloneProperTransfer = 1;
		var globalThis = requireGlobalThis();
		var fails = requireFails();
		var V8 = requireEnvironmentV8Version();
		var ENVIRONMENT = requireEnvironment();

		var structuredClone = globalThis.structuredClone;

		structuredCloneProperTransfer = !!structuredClone && !fails(function () {
		  // prevent V8 ArrayBufferDetaching protector cell invalidation and performance degradation
		  // https://github.com/zloirock/core-js/issues/679
		  if ((ENVIRONMENT === 'DENO' && V8 > 92) || (ENVIRONMENT === 'NODE' && V8 > 94) || (ENVIRONMENT === 'BROWSER' && V8 > 97)) return false;
		  var buffer = new ArrayBuffer(8);
		  var clone = structuredClone(buffer, { transfer: [buffer] });
		  return buffer.byteLength !== 0 || clone.byteLength !== 8;
		});
		return structuredCloneProperTransfer;
	}

	var detachTransferable;
	var hasRequiredDetachTransferable;

	function requireDetachTransferable () {
		if (hasRequiredDetachTransferable) return detachTransferable;
		hasRequiredDetachTransferable = 1;
		var globalThis = requireGlobalThis();
		var getBuiltInNodeModule = requireGetBuiltInNodeModule();
		var PROPER_STRUCTURED_CLONE_TRANSFER = requireStructuredCloneProperTransfer();

		var structuredClone = globalThis.structuredClone;
		var $ArrayBuffer = globalThis.ArrayBuffer;
		var $MessageChannel = globalThis.MessageChannel;
		var detach = false;
		var WorkerThreads, channel, buffer, $detach;

		if (PROPER_STRUCTURED_CLONE_TRANSFER) {
		  detach = function (transferable) {
		    structuredClone(transferable, { transfer: [transferable] });
		  };
		} else if ($ArrayBuffer) try {
		  if (!$MessageChannel) {
		    WorkerThreads = getBuiltInNodeModule('worker_threads');
		    if (WorkerThreads) $MessageChannel = WorkerThreads.MessageChannel;
		  }

		  if ($MessageChannel) {
		    channel = new $MessageChannel();
		    buffer = new $ArrayBuffer(2);

		    $detach = function (transferable) {
		      channel.port1.postMessage(null, [transferable]);
		    };

		    if (buffer.byteLength === 2) {
		      $detach(buffer);
		      if (buffer.byteLength === 0) detach = $detach;
		    }
		  }
		} catch (error) { /* empty */ }

		detachTransferable = detach;
		return detachTransferable;
	}

	var arrayBufferTransfer;
	var hasRequiredArrayBufferTransfer;

	function requireArrayBufferTransfer () {
		if (hasRequiredArrayBufferTransfer) return arrayBufferTransfer;
		hasRequiredArrayBufferTransfer = 1;
		var globalThis = requireGlobalThis();
		var uncurryThis = requireFunctionUncurryThis();
		var uncurryThisAccessor = requireFunctionUncurryThisAccessor();
		var toIndex = requireToIndex();
		var notDetached = requireArrayBufferNotDetached();
		var arrayBufferByteLength = requireArrayBufferByteLength();
		var detachTransferable = requireDetachTransferable();
		var PROPER_STRUCTURED_CLONE_TRANSFER = requireStructuredCloneProperTransfer();

		var structuredClone = globalThis.structuredClone;
		var ArrayBuffer = globalThis.ArrayBuffer;
		var DataView = globalThis.DataView;
		var min = Math.min;
		var ArrayBufferPrototype = ArrayBuffer.prototype;
		var DataViewPrototype = DataView.prototype;
		var slice = uncurryThis(ArrayBufferPrototype.slice);
		var isResizable = uncurryThisAccessor(ArrayBufferPrototype, 'resizable', 'get');
		var maxByteLength = uncurryThisAccessor(ArrayBufferPrototype, 'maxByteLength', 'get');
		var getInt8 = uncurryThis(DataViewPrototype.getInt8);
		var setInt8 = uncurryThis(DataViewPrototype.setInt8);

		arrayBufferTransfer = (PROPER_STRUCTURED_CLONE_TRANSFER || detachTransferable) && function (arrayBuffer, newLength, preserveResizability) {
		  var byteLength = arrayBufferByteLength(arrayBuffer);
		  var newByteLength = newLength === undefined ? byteLength : toIndex(newLength);
		  var fixedLength = !isResizable || !isResizable(arrayBuffer);
		  var newBuffer;
		  notDetached(arrayBuffer);
		  if (PROPER_STRUCTURED_CLONE_TRANSFER) {
		    arrayBuffer = structuredClone(arrayBuffer, { transfer: [arrayBuffer] });
		    if (byteLength === newByteLength && (preserveResizability || fixedLength)) return arrayBuffer;
		  }
		  if (byteLength >= newByteLength && (!preserveResizability || fixedLength)) {
		    newBuffer = slice(arrayBuffer, 0, newByteLength);
		  } else {
		    var options = preserveResizability && !fixedLength && maxByteLength ? { maxByteLength: maxByteLength(arrayBuffer) } : undefined;
		    newBuffer = new ArrayBuffer(newByteLength, options);
		    var a = new DataView(arrayBuffer);
		    var b = new DataView(newBuffer);
		    var copyLength = min(newByteLength, byteLength);
		    for (var i = 0; i < copyLength; i++) setInt8(b, i, getInt8(a, i));
		  }
		  if (!PROPER_STRUCTURED_CLONE_TRANSFER) detachTransferable(arrayBuffer);
		  return newBuffer;
		};
		return arrayBufferTransfer;
	}

	var hasRequiredEs_arrayBuffer_transfer;

	function requireEs_arrayBuffer_transfer () {
		if (hasRequiredEs_arrayBuffer_transfer) return es_arrayBuffer_transfer;
		hasRequiredEs_arrayBuffer_transfer = 1;
		var $ = require_export();
		var $transfer = requireArrayBufferTransfer();

		// `ArrayBuffer.prototype.transfer` method
		// https://tc39.es/proposal-arraybuffer-transfer/#sec-arraybuffer.prototype.transfer
		if ($transfer) $({ target: 'ArrayBuffer', proto: true }, {
		  transfer: function transfer() {
		    return $transfer(this, arguments.length ? arguments[0] : undefined, true);
		  }
		});
		return es_arrayBuffer_transfer;
	}

	requireEs_arrayBuffer_transfer();

	var es_arrayBuffer_transferToFixedLength = {};

	var hasRequiredEs_arrayBuffer_transferToFixedLength;

	function requireEs_arrayBuffer_transferToFixedLength () {
		if (hasRequiredEs_arrayBuffer_transferToFixedLength) return es_arrayBuffer_transferToFixedLength;
		hasRequiredEs_arrayBuffer_transferToFixedLength = 1;
		var $ = require_export();
		var $transfer = requireArrayBufferTransfer();

		// `ArrayBuffer.prototype.transferToFixedLength` method
		// https://tc39.es/proposal-arraybuffer-transfer/#sec-arraybuffer.prototype.transfertofixedlength
		if ($transfer) $({ target: 'ArrayBuffer', proto: true }, {
		  transferToFixedLength: function transferToFixedLength() {
		    return $transfer(this, arguments.length ? arguments[0] : undefined, false);
		  }
		});
		return es_arrayBuffer_transferToFixedLength;
	}

	requireEs_arrayBuffer_transferToFixedLength();

	var es_date_toPrimitive = {};

	var dateToPrimitive;
	var hasRequiredDateToPrimitive;

	function requireDateToPrimitive () {
		if (hasRequiredDateToPrimitive) return dateToPrimitive;
		hasRequiredDateToPrimitive = 1;
		var anObject = requireAnObject();
		var ordinaryToPrimitive = requireOrdinaryToPrimitive();

		var $TypeError = TypeError;

		// `Date.prototype[@@toPrimitive](hint)` method implementation
		// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
		dateToPrimitive = function (hint) {
		  anObject(this);
		  if (hint === 'string' || hint === 'default') hint = 'string';
		  else if (hint !== 'number') throw new $TypeError('Incorrect hint');
		  return ordinaryToPrimitive(this, hint);
		};
		return dateToPrimitive;
	}

	var hasRequiredEs_date_toPrimitive;

	function requireEs_date_toPrimitive () {
		if (hasRequiredEs_date_toPrimitive) return es_date_toPrimitive;
		hasRequiredEs_date_toPrimitive = 1;
		var hasOwn = requireHasOwnProperty();
		var defineBuiltIn = requireDefineBuiltIn();
		var dateToPrimitive = requireDateToPrimitive();
		var wellKnownSymbol = requireWellKnownSymbol();

		var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
		var DatePrototype = Date.prototype;

		// `Date.prototype[@@toPrimitive]` method
		// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
		if (!hasOwn(DatePrototype, TO_PRIMITIVE)) {
		  defineBuiltIn(DatePrototype, TO_PRIMITIVE, dateToPrimitive);
		}
		return es_date_toPrimitive;
	}

	requireEs_date_toPrimitive();

	var es_function_name = {};

	var hasRequiredEs_function_name;

	function requireEs_function_name () {
		if (hasRequiredEs_function_name) return es_function_name;
		hasRequiredEs_function_name = 1;
		var DESCRIPTORS = requireDescriptors();
		var FUNCTION_NAME_EXISTS = requireFunctionName().EXISTS;
		var uncurryThis = requireFunctionUncurryThis();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();

		var FunctionPrototype = Function.prototype;
		var functionToString = uncurryThis(FunctionPrototype.toString);
		var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
		var regExpExec = uncurryThis(nameRE.exec);
		var NAME = 'name';

		// Function instances `.name` property
		// https://tc39.es/ecma262/#sec-function-instances-name
		if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
		  defineBuiltInAccessor(FunctionPrototype, NAME, {
		    configurable: true,
		    get: function () {
		      try {
		        return regExpExec(nameRE, functionToString(this))[1];
		      } catch (error) {
		        return '';
		      }
		    }
		  });
		}
		return es_function_name;
	}

	requireEs_function_name();

	var es_globalThis = {};

	var hasRequiredEs_globalThis;

	function requireEs_globalThis () {
		if (hasRequiredEs_globalThis) return es_globalThis;
		hasRequiredEs_globalThis = 1;
		var $ = require_export();
		var globalThis = requireGlobalThis();

		// `globalThis` object
		// https://tc39.es/ecma262/#sec-globalthis
		$({ global: true, forced: globalThis.globalThis !== globalThis }, {
		  globalThis: globalThis
		});
		return es_globalThis;
	}

	requireEs_globalThis();

	requireEs_json_stringify();

	var es_json_toStringTag = {};

	var hasRequiredEs_json_toStringTag;

	function requireEs_json_toStringTag () {
		if (hasRequiredEs_json_toStringTag) return es_json_toStringTag;
		hasRequiredEs_json_toStringTag = 1;
		var globalThis = requireGlobalThis();
		var setToStringTag = requireSetToStringTag();

		// JSON[@@toStringTag] property
		// https://tc39.es/ecma262/#sec-json-@@tostringtag
		setToStringTag(globalThis.JSON, 'JSON', true);
		return es_json_toStringTag;
	}

	requireEs_json_toStringTag();

	var es_map = {};

	var es_map_constructor = {};

	var internalMetadata = {exports: {}};

	var arrayBufferNonExtensible;
	var hasRequiredArrayBufferNonExtensible;

	function requireArrayBufferNonExtensible () {
		if (hasRequiredArrayBufferNonExtensible) return arrayBufferNonExtensible;
		hasRequiredArrayBufferNonExtensible = 1;
		// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it
		var fails = requireFails();

		arrayBufferNonExtensible = fails(function () {
		  if (typeof ArrayBuffer == 'function') {
		    var buffer = new ArrayBuffer(8);
		    // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe
		    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
		  }
		});
		return arrayBufferNonExtensible;
	}

	var objectIsExtensible;
	var hasRequiredObjectIsExtensible;

	function requireObjectIsExtensible () {
		if (hasRequiredObjectIsExtensible) return objectIsExtensible;
		hasRequiredObjectIsExtensible = 1;
		var fails = requireFails();
		var isObject = requireIsObject();
		var classof = requireClassofRaw();
		var ARRAY_BUFFER_NON_EXTENSIBLE = requireArrayBufferNonExtensible();

		// eslint-disable-next-line es/no-object-isextensible -- safe
		var $isExtensible = Object.isExtensible;
		var FAILS_ON_PRIMITIVES = fails(function () { });

		// `Object.isExtensible` method
		// https://tc39.es/ecma262/#sec-object.isextensible
		objectIsExtensible = (FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE) ? function isExtensible(it) {
		  if (!isObject(it)) return false;
		  if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) === 'ArrayBuffer') return false;
		  return $isExtensible ? $isExtensible(it) : true;
		} : $isExtensible;
		return objectIsExtensible;
	}

	var freezing;
	var hasRequiredFreezing;

	function requireFreezing () {
		if (hasRequiredFreezing) return freezing;
		hasRequiredFreezing = 1;
		var fails = requireFails();

		freezing = !fails(function () {
		  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
		  return Object.isExtensible(Object.preventExtensions({}));
		});
		return freezing;
	}

	var hasRequiredInternalMetadata;

	function requireInternalMetadata () {
		if (hasRequiredInternalMetadata) return internalMetadata.exports;
		hasRequiredInternalMetadata = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThis();
		var hiddenKeys = requireHiddenKeys();
		var isObject = requireIsObject();
		var hasOwn = requireHasOwnProperty();
		var defineProperty = requireObjectDefineProperty().f;
		var getOwnPropertyNamesModule = requireObjectGetOwnPropertyNames();
		var getOwnPropertyNamesExternalModule = requireObjectGetOwnPropertyNamesExternal();
		var isExtensible = requireObjectIsExtensible();
		var uid = requireUid();
		var FREEZING = requireFreezing();

		var REQUIRED = false;
		var METADATA = uid('meta');
		var id = 0;

		var setMetadata = function (it) {
		  defineProperty(it, METADATA, { value: {
		    objectID: 'O' + id++, // object ID
		    weakData: {}          // weak collections IDs
		  } });
		};

		var fastKey = function (it, create) {
		  // return a primitive with prefix
		  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
		  if (!hasOwn(it, METADATA)) {
		    // can't set metadata to uncaught frozen object
		    if (!isExtensible(it)) return 'F';
		    // not necessary to add metadata
		    if (!create) return 'E';
		    // add missing metadata
		    setMetadata(it);
		  // return object ID
		  } return it[METADATA].objectID;
		};

		var getWeakData = function (it, create) {
		  if (!hasOwn(it, METADATA)) {
		    // can't set metadata to uncaught frozen object
		    if (!isExtensible(it)) return true;
		    // not necessary to add metadata
		    if (!create) return false;
		    // add missing metadata
		    setMetadata(it);
		  // return the store of weak collections IDs
		  } return it[METADATA].weakData;
		};

		// add metadata on freeze-family methods calling
		var onFreeze = function (it) {
		  if (FREEZING && REQUIRED && isExtensible(it) && !hasOwn(it, METADATA)) setMetadata(it);
		  return it;
		};

		var enable = function () {
		  meta.enable = function () { /* empty */ };
		  REQUIRED = true;
		  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
		  var splice = uncurryThis([].splice);
		  var test = {};
		  test[METADATA] = 1;

		  // prevent exposing of metadata key
		  if (getOwnPropertyNames(test).length) {
		    getOwnPropertyNamesModule.f = function (it) {
		      var result = getOwnPropertyNames(it);
		      for (var i = 0, length = result.length; i < length; i++) {
		        if (result[i] === METADATA) {
		          splice(result, i, 1);
		          break;
		        }
		      } return result;
		    };

		    $({ target: 'Object', stat: true, forced: true }, {
		      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
		    });
		  }
		};

		var meta = internalMetadata.exports = {
		  enable: enable,
		  fastKey: fastKey,
		  getWeakData: getWeakData,
		  onFreeze: onFreeze
		};

		hiddenKeys[METADATA] = true;
		return internalMetadata.exports;
	}

	var iterate;
	var hasRequiredIterate;

	function requireIterate () {
		if (hasRequiredIterate) return iterate;
		hasRequiredIterate = 1;
		var bind = requireFunctionBindContext();
		var call = requireFunctionCall();
		var anObject = requireAnObject();
		var tryToString = requireTryToString();
		var isArrayIteratorMethod = requireIsArrayIteratorMethod();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var getIterator = requireGetIterator();
		var getIteratorMethod = requireGetIteratorMethod();
		var iteratorClose = requireIteratorClose();

		var $TypeError = TypeError;

		var Result = function (stopped, result) {
		  this.stopped = stopped;
		  this.result = result;
		};

		var ResultPrototype = Result.prototype;

		iterate = function (iterable, unboundFunction, options) {
		  var that = options && options.that;
		  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
		  var IS_RECORD = !!(options && options.IS_RECORD);
		  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
		  var INTERRUPTED = !!(options && options.INTERRUPTED);
		  var fn = bind(unboundFunction, that);
		  var iterator, iterFn, index, length, result, next, step;

		  var stop = function (condition) {
		    if (iterator) iteratorClose(iterator, 'normal', condition);
		    return new Result(true, condition);
		  };

		  var callFn = function (value) {
		    if (AS_ENTRIES) {
		      anObject(value);
		      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
		    } return INTERRUPTED ? fn(value, stop) : fn(value);
		  };

		  if (IS_RECORD) {
		    iterator = iterable.iterator;
		  } else if (IS_ITERATOR) {
		    iterator = iterable;
		  } else {
		    iterFn = getIteratorMethod(iterable);
		    if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable');
		    // optimisation for array iterators
		    if (isArrayIteratorMethod(iterFn)) {
		      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
		        result = callFn(iterable[index]);
		        if (result && isPrototypeOf(ResultPrototype, result)) return result;
		      } return new Result(false);
		    }
		    iterator = getIterator(iterable, iterFn);
		  }

		  next = IS_RECORD ? iterable.next : iterator.next;
		  while (!(step = call(next, iterator)).done) {
		    try {
		      result = callFn(step.value);
		    } catch (error) {
		      iteratorClose(iterator, 'throw', error);
		    }
		    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
		  } return new Result(false);
		};
		return iterate;
	}

	var collection;
	var hasRequiredCollection;

	function requireCollection () {
		if (hasRequiredCollection) return collection;
		hasRequiredCollection = 1;
		var $ = require_export();
		var globalThis = requireGlobalThis();
		var uncurryThis = requireFunctionUncurryThis();
		var isForced = requireIsForced();
		var defineBuiltIn = requireDefineBuiltIn();
		var InternalMetadataModule = requireInternalMetadata();
		var iterate = requireIterate();
		var anInstance = requireAnInstance();
		var isCallable = requireIsCallable();
		var isNullOrUndefined = requireIsNullOrUndefined();
		var isObject = requireIsObject();
		var fails = requireFails();
		var checkCorrectnessOfIteration = requireCheckCorrectnessOfIteration();
		var setToStringTag = requireSetToStringTag();
		var inheritIfRequired = requireInheritIfRequired();

		collection = function (CONSTRUCTOR_NAME, wrapper, common) {
		  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
		  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
		  var ADDER = IS_MAP ? 'set' : 'add';
		  var NativeConstructor = globalThis[CONSTRUCTOR_NAME];
		  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
		  var Constructor = NativeConstructor;
		  var exported = {};

		  var fixMethod = function (KEY) {
		    var uncurriedNativeMethod = uncurryThis(NativePrototype[KEY]);
		    defineBuiltIn(NativePrototype, KEY,
		      KEY === 'add' ? function add(value) {
		        uncurriedNativeMethod(this, value === 0 ? 0 : value);
		        return this;
		      } : KEY === 'delete' ? function (key) {
		        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
		      } : KEY === 'get' ? function get(key) {
		        return IS_WEAK && !isObject(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
		      } : KEY === 'has' ? function has(key) {
		        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
		      } : function set(key, value) {
		        uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
		        return this;
		      }
		    );
		  };

		  var REPLACE = isForced(
		    CONSTRUCTOR_NAME,
		    !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
		      new NativeConstructor().entries().next();
		    }))
		  );

		  if (REPLACE) {
		    // create collection constructor
		    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
		    InternalMetadataModule.enable();
		  } else if (isForced(CONSTRUCTOR_NAME, true)) {
		    var instance = new Constructor();
		    // early implementations not supports chaining
		    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) !== instance;
		    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
		    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
		    // most early implementations doesn't supports iterables, most modern - not close it correctly
		    // eslint-disable-next-line no-new -- required for testing
		    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
		    // for early implementations -0 and +0 not the same
		    var BUGGY_ZERO = !IS_WEAK && fails(function () {
		      // V8 ~ Chromium 42- fails only with 5+ elements
		      var $instance = new NativeConstructor();
		      var index = 5;
		      while (index--) $instance[ADDER](index, index);
		      return !$instance.has(-0);
		    });

		    if (!ACCEPT_ITERABLES) {
		      Constructor = wrapper(function (dummy, iterable) {
		        anInstance(dummy, NativePrototype);
		        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
		        if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
		        return that;
		      });
		      Constructor.prototype = NativePrototype;
		      NativePrototype.constructor = Constructor;
		    }

		    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
		      fixMethod('delete');
		      fixMethod('has');
		      IS_MAP && fixMethod('get');
		    }

		    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

		    // weak collections should not contains .clear method
		    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
		  }

		  exported[CONSTRUCTOR_NAME] = Constructor;
		  $({ global: true, constructor: true, forced: Constructor !== NativeConstructor }, exported);

		  setToStringTag(Constructor, CONSTRUCTOR_NAME);

		  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

		  return Constructor;
		};
		return collection;
	}

	var collectionStrong;
	var hasRequiredCollectionStrong;

	function requireCollectionStrong () {
		if (hasRequiredCollectionStrong) return collectionStrong;
		hasRequiredCollectionStrong = 1;
		var create = requireObjectCreate();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var defineBuiltIns = requireDefineBuiltIns();
		var bind = requireFunctionBindContext();
		var anInstance = requireAnInstance();
		var isNullOrUndefined = requireIsNullOrUndefined();
		var iterate = requireIterate();
		var defineIterator = requireIteratorDefine();
		var createIterResultObject = requireCreateIterResultObject();
		var setSpecies = requireSetSpecies();
		var DESCRIPTORS = requireDescriptors();
		var fastKey = requireInternalMetadata().fastKey;
		var InternalStateModule = requireInternalState();

		var setInternalState = InternalStateModule.set;
		var internalStateGetterFor = InternalStateModule.getterFor;

		collectionStrong = {
		  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
		    var Constructor = wrapper(function (that, iterable) {
		      anInstance(that, Prototype);
		      setInternalState(that, {
		        type: CONSTRUCTOR_NAME,
		        index: create(null),
		        first: null,
		        last: null,
		        size: 0
		      });
		      if (!DESCRIPTORS) that.size = 0;
		      if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
		    });

		    var Prototype = Constructor.prototype;

		    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

		    var define = function (that, key, value) {
		      var state = getInternalState(that);
		      var entry = getEntry(that, key);
		      var previous, index;
		      // change existing entry
		      if (entry) {
		        entry.value = value;
		      // create new entry
		      } else {
		        state.last = entry = {
		          index: index = fastKey(key, true),
		          key: key,
		          value: value,
		          previous: previous = state.last,
		          next: null,
		          removed: false
		        };
		        if (!state.first) state.first = entry;
		        if (previous) previous.next = entry;
		        if (DESCRIPTORS) state.size++;
		        else that.size++;
		        // add to index
		        if (index !== 'F') state.index[index] = entry;
		      } return that;
		    };

		    var getEntry = function (that, key) {
		      var state = getInternalState(that);
		      // fast case
		      var index = fastKey(key);
		      var entry;
		      if (index !== 'F') return state.index[index];
		      // frozen object case
		      for (entry = state.first; entry; entry = entry.next) {
		        if (entry.key === key) return entry;
		      }
		    };

		    defineBuiltIns(Prototype, {
		      // `{ Map, Set }.prototype.clear()` methods
		      // https://tc39.es/ecma262/#sec-map.prototype.clear
		      // https://tc39.es/ecma262/#sec-set.prototype.clear
		      clear: function clear() {
		        var that = this;
		        var state = getInternalState(that);
		        var entry = state.first;
		        while (entry) {
		          entry.removed = true;
		          if (entry.previous) entry.previous = entry.previous.next = null;
		          entry = entry.next;
		        }
		        state.first = state.last = null;
		        state.index = create(null);
		        if (DESCRIPTORS) state.size = 0;
		        else that.size = 0;
		      },
		      // `{ Map, Set }.prototype.delete(key)` methods
		      // https://tc39.es/ecma262/#sec-map.prototype.delete
		      // https://tc39.es/ecma262/#sec-set.prototype.delete
		      'delete': function (key) {
		        var that = this;
		        var state = getInternalState(that);
		        var entry = getEntry(that, key);
		        if (entry) {
		          var next = entry.next;
		          var prev = entry.previous;
		          delete state.index[entry.index];
		          entry.removed = true;
		          if (prev) prev.next = next;
		          if (next) next.previous = prev;
		          if (state.first === entry) state.first = next;
		          if (state.last === entry) state.last = prev;
		          if (DESCRIPTORS) state.size--;
		          else that.size--;
		        } return !!entry;
		      },
		      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
		      // https://tc39.es/ecma262/#sec-map.prototype.foreach
		      // https://tc39.es/ecma262/#sec-set.prototype.foreach
		      forEach: function forEach(callbackfn /* , that = undefined */) {
		        var state = getInternalState(this);
		        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		        var entry;
		        while (entry = entry ? entry.next : state.first) {
		          boundFunction(entry.value, entry.key, this);
		          // revert to the last existing entry
		          while (entry && entry.removed) entry = entry.previous;
		        }
		      },
		      // `{ Map, Set}.prototype.has(key)` methods
		      // https://tc39.es/ecma262/#sec-map.prototype.has
		      // https://tc39.es/ecma262/#sec-set.prototype.has
		      has: function has(key) {
		        return !!getEntry(this, key);
		      }
		    });

		    defineBuiltIns(Prototype, IS_MAP ? {
		      // `Map.prototype.get(key)` method
		      // https://tc39.es/ecma262/#sec-map.prototype.get
		      get: function get(key) {
		        var entry = getEntry(this, key);
		        return entry && entry.value;
		      },
		      // `Map.prototype.set(key, value)` method
		      // https://tc39.es/ecma262/#sec-map.prototype.set
		      set: function set(key, value) {
		        return define(this, key === 0 ? 0 : key, value);
		      }
		    } : {
		      // `Set.prototype.add(value)` method
		      // https://tc39.es/ecma262/#sec-set.prototype.add
		      add: function add(value) {
		        return define(this, value = value === 0 ? 0 : value, value);
		      }
		    });
		    if (DESCRIPTORS) defineBuiltInAccessor(Prototype, 'size', {
		      configurable: true,
		      get: function () {
		        return getInternalState(this).size;
		      }
		    });
		    return Constructor;
		  },
		  setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
		    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
		    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
		    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
		    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
		    // https://tc39.es/ecma262/#sec-map.prototype.entries
		    // https://tc39.es/ecma262/#sec-map.prototype.keys
		    // https://tc39.es/ecma262/#sec-map.prototype.values
		    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
		    // https://tc39.es/ecma262/#sec-set.prototype.entries
		    // https://tc39.es/ecma262/#sec-set.prototype.keys
		    // https://tc39.es/ecma262/#sec-set.prototype.values
		    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
		    defineIterator(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
		      setInternalState(this, {
		        type: ITERATOR_NAME,
		        target: iterated,
		        state: getInternalCollectionState(iterated),
		        kind: kind,
		        last: null
		      });
		    }, function () {
		      var state = getInternalIteratorState(this);
		      var kind = state.kind;
		      var entry = state.last;
		      // revert to the last existing entry
		      while (entry && entry.removed) entry = entry.previous;
		      // get next entry
		      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
		        // or finish the iteration
		        state.target = null;
		        return createIterResultObject(undefined, true);
		      }
		      // return step by kind
		      if (kind === 'keys') return createIterResultObject(entry.key, false);
		      if (kind === 'values') return createIterResultObject(entry.value, false);
		      return createIterResultObject([entry.key, entry.value], false);
		    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

		    // `{ Map, Set }.prototype[@@species]` accessors
		    // https://tc39.es/ecma262/#sec-get-map-@@species
		    // https://tc39.es/ecma262/#sec-get-set-@@species
		    setSpecies(CONSTRUCTOR_NAME);
		  }
		};
		return collectionStrong;
	}

	var hasRequiredEs_map_constructor;

	function requireEs_map_constructor () {
		if (hasRequiredEs_map_constructor) return es_map_constructor;
		hasRequiredEs_map_constructor = 1;
		var collection = requireCollection();
		var collectionStrong = requireCollectionStrong();

		// `Map` constructor
		// https://tc39.es/ecma262/#sec-map-objects
		collection('Map', function (init) {
		  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
		}, collectionStrong);
		return es_map_constructor;
	}

	var hasRequiredEs_map;

	function requireEs_map () {
		if (hasRequiredEs_map) return es_map;
		hasRequiredEs_map = 1;
		// TODO: Remove this module from `core-js@4` since it's replaced to module below
		requireEs_map_constructor();
		return es_map;
	}

	requireEs_map();

	var es_math_toStringTag = {};

	var hasRequiredEs_math_toStringTag;

	function requireEs_math_toStringTag () {
		if (hasRequiredEs_math_toStringTag) return es_math_toStringTag;
		hasRequiredEs_math_toStringTag = 1;
		var setToStringTag = requireSetToStringTag();

		// Math[@@toStringTag] property
		// https://tc39.es/ecma262/#sec-math-@@tostringtag
		setToStringTag(Math, 'Math', true);
		return es_math_toStringTag;
	}

	requireEs_math_toStringTag();

	var es_math_trunc = {};

	var hasRequiredEs_math_trunc;

	function requireEs_math_trunc () {
		if (hasRequiredEs_math_trunc) return es_math_trunc;
		hasRequiredEs_math_trunc = 1;
		var $ = require_export();
		var trunc = requireMathTrunc();

		// `Math.trunc` method
		// https://tc39.es/ecma262/#sec-math.trunc
		$({ target: 'Math', stat: true }, {
		  trunc: trunc
		});
		return es_math_trunc;
	}

	requireEs_math_trunc();

	var es_number_constructor = {};

	var thisNumberValue;
	var hasRequiredThisNumberValue;

	function requireThisNumberValue () {
		if (hasRequiredThisNumberValue) return thisNumberValue;
		hasRequiredThisNumberValue = 1;
		var uncurryThis = requireFunctionUncurryThis();

		// `thisNumberValue` abstract operation
		// https://tc39.es/ecma262/#sec-thisnumbervalue
		thisNumberValue = uncurryThis(1.0.valueOf);
		return thisNumberValue;
	}

	var whitespaces;
	var hasRequiredWhitespaces;

	function requireWhitespaces () {
		if (hasRequiredWhitespaces) return whitespaces;
		hasRequiredWhitespaces = 1;
		// a string of all valid unicode whitespaces
		whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
		  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
		return whitespaces;
	}

	var stringTrim;
	var hasRequiredStringTrim;

	function requireStringTrim () {
		if (hasRequiredStringTrim) return stringTrim;
		hasRequiredStringTrim = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var toString = requireToString();
		var whitespaces = requireWhitespaces();

		var replace = uncurryThis(''.replace);
		var ltrim = RegExp('^[' + whitespaces + ']+');
		var rtrim = RegExp('(^|[^' + whitespaces + '])[' + whitespaces + ']+$');

		// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
		var createMethod = function (TYPE) {
		  return function ($this) {
		    var string = toString(requireObjectCoercible($this));
		    if (TYPE & 1) string = replace(string, ltrim, '');
		    if (TYPE & 2) string = replace(string, rtrim, '$1');
		    return string;
		  };
		};

		stringTrim = {
		  // `String.prototype.{ trimLeft, trimStart }` methods
		  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
		  start: createMethod(1),
		  // `String.prototype.{ trimRight, trimEnd }` methods
		  // https://tc39.es/ecma262/#sec-string.prototype.trimend
		  end: createMethod(2),
		  // `String.prototype.trim` method
		  // https://tc39.es/ecma262/#sec-string.prototype.trim
		  trim: createMethod(3)
		};
		return stringTrim;
	}

	var hasRequiredEs_number_constructor;

	function requireEs_number_constructor () {
		if (hasRequiredEs_number_constructor) return es_number_constructor;
		hasRequiredEs_number_constructor = 1;
		var $ = require_export();
		var IS_PURE = requireIsPure();
		var DESCRIPTORS = requireDescriptors();
		var globalThis = requireGlobalThis();
		var path = requirePath();
		var uncurryThis = requireFunctionUncurryThis();
		var isForced = requireIsForced();
		var hasOwn = requireHasOwnProperty();
		var inheritIfRequired = requireInheritIfRequired();
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var isSymbol = requireIsSymbol();
		var toPrimitive = requireToPrimitive();
		var fails = requireFails();
		var getOwnPropertyNames = requireObjectGetOwnPropertyNames().f;
		var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
		var defineProperty = requireObjectDefineProperty().f;
		var thisNumberValue = requireThisNumberValue();
		var trim = requireStringTrim().trim;

		var NUMBER = 'Number';
		var NativeNumber = globalThis[NUMBER];
		var PureNumberNamespace = path[NUMBER];
		var NumberPrototype = NativeNumber.prototype;
		var TypeError = globalThis.TypeError;
		var stringSlice = uncurryThis(''.slice);
		var charCodeAt = uncurryThis(''.charCodeAt);

		// `ToNumeric` abstract operation
		// https://tc39.es/ecma262/#sec-tonumeric
		var toNumeric = function (value) {
		  var primValue = toPrimitive(value, 'number');
		  return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
		};

		// `ToNumber` abstract operation
		// https://tc39.es/ecma262/#sec-tonumber
		var toNumber = function (argument) {
		  var it = toPrimitive(argument, 'number');
		  var first, third, radix, maxCode, digits, length, index, code;
		  if (isSymbol(it)) throw new TypeError('Cannot convert a Symbol value to a number');
		  if (typeof it == 'string' && it.length > 2) {
		    it = trim(it);
		    first = charCodeAt(it, 0);
		    if (first === 43 || first === 45) {
		      third = charCodeAt(it, 2);
		      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
		    } else if (first === 48) {
		      switch (charCodeAt(it, 1)) {
		        // fast equal of /^0b[01]+$/i
		        case 66:
		        case 98:
		          radix = 2;
		          maxCode = 49;
		          break;
		        // fast equal of /^0o[0-7]+$/i
		        case 79:
		        case 111:
		          radix = 8;
		          maxCode = 55;
		          break;
		        default:
		          return +it;
		      }
		      digits = stringSlice(it, 2);
		      length = digits.length;
		      for (index = 0; index < length; index++) {
		        code = charCodeAt(digits, index);
		        // parseInt parses a string to a first unavailable symbol
		        // but ToNumber should return NaN if a string contains unavailable symbols
		        if (code < 48 || code > maxCode) return NaN;
		      } return parseInt(digits, radix);
		    }
		  } return +it;
		};

		var FORCED = isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'));

		var calledWithNew = function (dummy) {
		  // includes check on 1..constructor(foo) case
		  return isPrototypeOf(NumberPrototype, dummy) && fails(function () { thisNumberValue(dummy); });
		};

		// `Number` constructor
		// https://tc39.es/ecma262/#sec-number-constructor
		var NumberWrapper = function Number(value) {
		  var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
		  return calledWithNew(this) ? inheritIfRequired(Object(n), this, NumberWrapper) : n;
		};

		NumberWrapper.prototype = NumberPrototype;
		if (FORCED && !IS_PURE) NumberPrototype.constructor = NumberWrapper;

		$({ global: true, constructor: true, wrap: true, forced: FORCED }, {
		  Number: NumberWrapper
		});

		// Use `internal/copy-constructor-properties` helper in `core-js@4`
		var copyConstructorProperties = function (target, source) {
		  for (var keys = DESCRIPTORS ? getOwnPropertyNames(source) : (
		    // ES3:
		    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
		    // ES2015 (in case, if modules with ES2015 Number statics required before):
		    'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' +
		    // ESNext
		    'fromString,range'
		  ).split(','), j = 0, key; keys.length > j; j++) {
		    if (hasOwn(source, key = keys[j]) && !hasOwn(target, key)) {
		      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
		    }
		  }
		};

		if (IS_PURE && PureNumberNamespace) copyConstructorProperties(path[NUMBER], PureNumberNamespace);
		if (FORCED || IS_PURE) copyConstructorProperties(path[NUMBER], NativeNumber);
		return es_number_constructor;
	}

	requireEs_number_constructor();

	var es_number_isNan = {};

	var hasRequiredEs_number_isNan;

	function requireEs_number_isNan () {
		if (hasRequiredEs_number_isNan) return es_number_isNan;
		hasRequiredEs_number_isNan = 1;
		var $ = require_export();

		// `Number.isNaN` method
		// https://tc39.es/ecma262/#sec-number.isnan
		$({ target: 'Number', stat: true }, {
		  isNaN: function isNaN(number) {
		    // eslint-disable-next-line no-self-compare -- NaN check
		    return number !== number;
		  }
		});
		return es_number_isNan;
	}

	requireEs_number_isNan();

	var es_number_parseFloat = {};

	var numberParseFloat;
	var hasRequiredNumberParseFloat;

	function requireNumberParseFloat () {
		if (hasRequiredNumberParseFloat) return numberParseFloat;
		hasRequiredNumberParseFloat = 1;
		var globalThis = requireGlobalThis();
		var fails = requireFails();
		var uncurryThis = requireFunctionUncurryThis();
		var toString = requireToString();
		var trim = requireStringTrim().trim;
		var whitespaces = requireWhitespaces();

		var charAt = uncurryThis(''.charAt);
		var $parseFloat = globalThis.parseFloat;
		var Symbol = globalThis.Symbol;
		var ITERATOR = Symbol && Symbol.iterator;
		var FORCED = 1 / $parseFloat(whitespaces + '-0') !== -Infinity
		  // MS Edge 18- broken with boxed symbols
		  || (ITERATOR && !fails(function () { $parseFloat(Object(ITERATOR)); }));

		// `parseFloat` method
		// https://tc39.es/ecma262/#sec-parsefloat-string
		numberParseFloat = FORCED ? function parseFloat(string) {
		  var trimmedString = trim(toString(string));
		  var result = $parseFloat(trimmedString);
		  return result === 0 && charAt(trimmedString, 0) === '-' ? -0 : result;
		} : $parseFloat;
		return numberParseFloat;
	}

	var hasRequiredEs_number_parseFloat;

	function requireEs_number_parseFloat () {
		if (hasRequiredEs_number_parseFloat) return es_number_parseFloat;
		hasRequiredEs_number_parseFloat = 1;
		var $ = require_export();
		var parseFloat = requireNumberParseFloat();

		// `Number.parseFloat` method
		// https://tc39.es/ecma262/#sec-number.parseFloat
		// eslint-disable-next-line es/no-number-parsefloat -- required for testing
		$({ target: 'Number', stat: true, forced: Number.parseFloat !== parseFloat }, {
		  parseFloat: parseFloat
		});
		return es_number_parseFloat;
	}

	requireEs_number_parseFloat();

	var es_number_parseInt = {};

	var numberParseInt;
	var hasRequiredNumberParseInt;

	function requireNumberParseInt () {
		if (hasRequiredNumberParseInt) return numberParseInt;
		hasRequiredNumberParseInt = 1;
		var globalThis = requireGlobalThis();
		var fails = requireFails();
		var uncurryThis = requireFunctionUncurryThis();
		var toString = requireToString();
		var trim = requireStringTrim().trim;
		var whitespaces = requireWhitespaces();

		var $parseInt = globalThis.parseInt;
		var Symbol = globalThis.Symbol;
		var ITERATOR = Symbol && Symbol.iterator;
		var hex = /^[+-]?0x/i;
		var exec = uncurryThis(hex.exec);
		var FORCED = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22
		  // MS Edge 18- broken with boxed symbols
		  || (ITERATOR && !fails(function () { $parseInt(Object(ITERATOR)); }));

		// `parseInt` method
		// https://tc39.es/ecma262/#sec-parseint-string-radix
		numberParseInt = FORCED ? function parseInt(string, radix) {
		  var S = trim(toString(string));
		  return $parseInt(S, (radix >>> 0) || (exec(hex, S) ? 16 : 10));
		} : $parseInt;
		return numberParseInt;
	}

	var hasRequiredEs_number_parseInt;

	function requireEs_number_parseInt () {
		if (hasRequiredEs_number_parseInt) return es_number_parseInt;
		hasRequiredEs_number_parseInt = 1;
		var $ = require_export();
		var parseInt = requireNumberParseInt();

		// `Number.parseInt` method
		// https://tc39.es/ecma262/#sec-number.parseint
		// eslint-disable-next-line es/no-number-parseint -- required for testing
		$({ target: 'Number', stat: true, forced: Number.parseInt !== parseInt }, {
		  parseInt: parseInt
		});
		return es_number_parseInt;
	}

	requireEs_number_parseInt();

	var es_number_toFixed = {};

	var stringRepeat;
	var hasRequiredStringRepeat;

	function requireStringRepeat () {
		if (hasRequiredStringRepeat) return stringRepeat;
		hasRequiredStringRepeat = 1;
		var toIntegerOrInfinity = requireToIntegerOrInfinity();
		var toString = requireToString();
		var requireObjectCoercible = requireRequireObjectCoercible();

		var $RangeError = RangeError;

		// `String.prototype.repeat` method implementation
		// https://tc39.es/ecma262/#sec-string.prototype.repeat
		stringRepeat = function repeat(count) {
		  var str = toString(requireObjectCoercible(this));
		  var result = '';
		  var n = toIntegerOrInfinity(count);
		  if (n < 0 || n === Infinity) throw new $RangeError('Wrong number of repetitions');
		  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
		  return result;
		};
		return stringRepeat;
	}

	var hasRequiredEs_number_toFixed;

	function requireEs_number_toFixed () {
		if (hasRequiredEs_number_toFixed) return es_number_toFixed;
		hasRequiredEs_number_toFixed = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThis();
		var toIntegerOrInfinity = requireToIntegerOrInfinity();
		var thisNumberValue = requireThisNumberValue();
		var $repeat = requireStringRepeat();
		var fails = requireFails();

		var $RangeError = RangeError;
		var $String = String;
		var floor = Math.floor;
		var repeat = uncurryThis($repeat);
		var stringSlice = uncurryThis(''.slice);
		var nativeToFixed = uncurryThis(1.0.toFixed);

		var pow = function (x, n, acc) {
		  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
		};

		var log = function (x) {
		  var n = 0;
		  var x2 = x;
		  while (x2 >= 4096) {
		    n += 12;
		    x2 /= 4096;
		  }
		  while (x2 >= 2) {
		    n += 1;
		    x2 /= 2;
		  } return n;
		};

		var multiply = function (data, n, c) {
		  var index = -1;
		  var c2 = c;
		  while (++index < 6) {
		    c2 += n * data[index];
		    data[index] = c2 % 1e7;
		    c2 = floor(c2 / 1e7);
		  }
		};

		var divide = function (data, n) {
		  var index = 6;
		  var c = 0;
		  while (--index >= 0) {
		    c += data[index];
		    data[index] = floor(c / n);
		    c = (c % n) * 1e7;
		  }
		};

		var dataToString = function (data) {
		  var index = 6;
		  var s = '';
		  while (--index >= 0) {
		    if (s !== '' || index === 0 || data[index] !== 0) {
		      var t = $String(data[index]);
		      s = s === '' ? t : s + repeat('0', 7 - t.length) + t;
		    }
		  } return s;
		};

		var FORCED = fails(function () {
		  return nativeToFixed(0.00008, 3) !== '0.000' ||
		    nativeToFixed(0.9, 0) !== '1' ||
		    nativeToFixed(1.255, 2) !== '1.25' ||
		    nativeToFixed(1000000000000000128.0, 0) !== '1000000000000000128';
		}) || !fails(function () {
		  // V8 ~ Android 4.3-
		  nativeToFixed({});
		});

		// `Number.prototype.toFixed` method
		// https://tc39.es/ecma262/#sec-number.prototype.tofixed
		$({ target: 'Number', proto: true, forced: FORCED }, {
		  toFixed: function toFixed(fractionDigits) {
		    var number = thisNumberValue(this);
		    var fractDigits = toIntegerOrInfinity(fractionDigits);
		    var data = [0, 0, 0, 0, 0, 0];
		    var sign = '';
		    var result = '0';
		    var e, z, j, k;

		    // TODO: ES2018 increased the maximum number of fraction digits to 100, need to improve the implementation
		    if (fractDigits < 0 || fractDigits > 20) throw new $RangeError('Incorrect fraction digits');
		    // eslint-disable-next-line no-self-compare -- NaN check
		    if (number !== number) return 'NaN';
		    if (number <= -1e21 || number >= 1e21) return $String(number);
		    if (number < 0) {
		      sign = '-';
		      number = -number;
		    }
		    if (number > 1e-21) {
		      e = log(number * pow(2, 69, 1)) - 69;
		      z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
		      z *= 0x10000000000000;
		      e = 52 - e;
		      if (e > 0) {
		        multiply(data, 0, z);
		        j = fractDigits;
		        while (j >= 7) {
		          multiply(data, 1e7, 0);
		          j -= 7;
		        }
		        multiply(data, pow(10, j, 1), 0);
		        j = e - 1;
		        while (j >= 23) {
		          divide(data, 1 << 23);
		          j -= 23;
		        }
		        divide(data, 1 << j);
		        multiply(data, 1, 1);
		        divide(data, 2);
		        result = dataToString(data);
		      } else {
		        multiply(data, 0, z);
		        multiply(data, 1 << -e, 0);
		        result = dataToString(data) + repeat('0', fractDigits);
		      }
		    }
		    if (fractDigits > 0) {
		      k = result.length;
		      result = sign + (k <= fractDigits
		        ? '0.' + repeat('0', fractDigits - k) + result
		        : stringSlice(result, 0, k - fractDigits) + '.' + stringSlice(result, k - fractDigits));
		    } else {
		      result = sign + result;
		    } return result;
		  }
		});
		return es_number_toFixed;
	}

	requireEs_number_toFixed();

	var es_object_assign = {};

	var objectAssign;
	var hasRequiredObjectAssign;

	function requireObjectAssign () {
		if (hasRequiredObjectAssign) return objectAssign;
		hasRequiredObjectAssign = 1;
		var DESCRIPTORS = requireDescriptors();
		var uncurryThis = requireFunctionUncurryThis();
		var call = requireFunctionCall();
		var fails = requireFails();
		var objectKeys = requireObjectKeys();
		var getOwnPropertySymbolsModule = requireObjectGetOwnPropertySymbols();
		var propertyIsEnumerableModule = requireObjectPropertyIsEnumerable();
		var toObject = requireToObject();
		var IndexedObject = requireIndexedObject();

		// eslint-disable-next-line es/no-object-assign -- safe
		var $assign = Object.assign;
		// eslint-disable-next-line es/no-object-defineproperty -- required for testing
		var defineProperty = Object.defineProperty;
		var concat = uncurryThis([].concat);

		// `Object.assign` method
		// https://tc39.es/ecma262/#sec-object.assign
		objectAssign = !$assign || fails(function () {
		  // should have correct order of operations (Edge bug)
		  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
		    enumerable: true,
		    get: function () {
		      defineProperty(this, 'b', {
		        value: 3,
		        enumerable: false
		      });
		    }
		  }), { b: 2 })).b !== 1) return true;
		  // should work with symbols and should have deterministic property order (V8 bug)
		  var A = {};
		  var B = {};
		  // eslint-disable-next-line es/no-symbol -- safe
		  var symbol = Symbol('assign detection');
		  var alphabet = 'abcdefghijklmnopqrst';
		  A[symbol] = 7;
		  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
		  return $assign({}, A)[symbol] !== 7 || objectKeys($assign({}, B)).join('') !== alphabet;
		}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
		  var T = toObject(target);
		  var argumentsLength = arguments.length;
		  var index = 1;
		  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
		  var propertyIsEnumerable = propertyIsEnumerableModule.f;
		  while (argumentsLength > index) {
		    var S = IndexedObject(arguments[index++]);
		    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
		    var length = keys.length;
		    var j = 0;
		    var key;
		    while (length > j) {
		      key = keys[j++];
		      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
		    }
		  } return T;
		} : $assign;
		return objectAssign;
	}

	var hasRequiredEs_object_assign;

	function requireEs_object_assign () {
		if (hasRequiredEs_object_assign) return es_object_assign;
		hasRequiredEs_object_assign = 1;
		var $ = require_export();
		var assign = requireObjectAssign();

		// `Object.assign` method
		// https://tc39.es/ecma262/#sec-object.assign
		// eslint-disable-next-line es/no-object-assign -- required for testing
		$({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign }, {
		  assign: assign
		});
		return es_object_assign;
	}

	requireEs_object_assign();

	var es_object_entries = {};

	var objectToArray;
	var hasRequiredObjectToArray;

	function requireObjectToArray () {
		if (hasRequiredObjectToArray) return objectToArray;
		hasRequiredObjectToArray = 1;
		var DESCRIPTORS = requireDescriptors();
		var fails = requireFails();
		var uncurryThis = requireFunctionUncurryThis();
		var objectGetPrototypeOf = requireObjectGetPrototypeOf();
		var objectKeys = requireObjectKeys();
		var toIndexedObject = requireToIndexedObject();
		var $propertyIsEnumerable = requireObjectPropertyIsEnumerable().f;

		var propertyIsEnumerable = uncurryThis($propertyIsEnumerable);
		var push = uncurryThis([].push);

		// in some IE versions, `propertyIsEnumerable` returns incorrect result on integer keys
		// of `null` prototype objects
		var IE_BUG = DESCRIPTORS && fails(function () {
		  // eslint-disable-next-line es/no-object-create -- safe
		  var O = Object.create(null);
		  O[2] = 2;
		  return !propertyIsEnumerable(O, 2);
		});

		// `Object.{ entries, values }` methods implementation
		var createMethod = function (TO_ENTRIES) {
		  return function (it) {
		    var O = toIndexedObject(it);
		    var keys = objectKeys(O);
		    var IE_WORKAROUND = IE_BUG && objectGetPrototypeOf(O) === null;
		    var length = keys.length;
		    var i = 0;
		    var result = [];
		    var key;
		    while (length > i) {
		      key = keys[i++];
		      if (!DESCRIPTORS || (IE_WORKAROUND ? key in O : propertyIsEnumerable(O, key))) {
		        push(result, TO_ENTRIES ? [key, O[key]] : O[key]);
		      }
		    }
		    return result;
		  };
		};

		objectToArray = {
		  // `Object.entries` method
		  // https://tc39.es/ecma262/#sec-object.entries
		  entries: createMethod(true),
		  // `Object.values` method
		  // https://tc39.es/ecma262/#sec-object.values
		  values: createMethod(false)
		};
		return objectToArray;
	}

	var hasRequiredEs_object_entries;

	function requireEs_object_entries () {
		if (hasRequiredEs_object_entries) return es_object_entries;
		hasRequiredEs_object_entries = 1;
		var $ = require_export();
		var $entries = requireObjectToArray().entries;

		// `Object.entries` method
		// https://tc39.es/ecma262/#sec-object.entries
		$({ target: 'Object', stat: true }, {
		  entries: function entries(O) {
		    return $entries(O);
		  }
		});
		return es_object_entries;
	}

	requireEs_object_entries();

	var es_object_freeze = {};

	var hasRequiredEs_object_freeze;

	function requireEs_object_freeze () {
		if (hasRequiredEs_object_freeze) return es_object_freeze;
		hasRequiredEs_object_freeze = 1;
		var $ = require_export();
		var FREEZING = requireFreezing();
		var fails = requireFails();
		var isObject = requireIsObject();
		var onFreeze = requireInternalMetadata().onFreeze;

		// eslint-disable-next-line es/no-object-freeze -- safe
		var $freeze = Object.freeze;
		var FAILS_ON_PRIMITIVES = fails(function () { $freeze(1); });

		// `Object.freeze` method
		// https://tc39.es/ecma262/#sec-object.freeze
		$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
		  freeze: function freeze(it) {
		    return $freeze && isObject(it) ? $freeze(onFreeze(it)) : it;
		  }
		});
		return es_object_freeze;
	}

	requireEs_object_freeze();

	var es_object_getOwnPropertyDescriptor = {};

	var hasRequiredEs_object_getOwnPropertyDescriptor;

	function requireEs_object_getOwnPropertyDescriptor () {
		if (hasRequiredEs_object_getOwnPropertyDescriptor) return es_object_getOwnPropertyDescriptor;
		hasRequiredEs_object_getOwnPropertyDescriptor = 1;
		var $ = require_export();
		var fails = requireFails();
		var toIndexedObject = requireToIndexedObject();
		var nativeGetOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
		var DESCRIPTORS = requireDescriptors();

		var FORCED = !DESCRIPTORS || fails(function () { nativeGetOwnPropertyDescriptor(1); });

		// `Object.getOwnPropertyDescriptor` method
		// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
		$({ target: 'Object', stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
		  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
		    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
		  }
		});
		return es_object_getOwnPropertyDescriptor;
	}

	requireEs_object_getOwnPropertyDescriptor();

	var es_object_getOwnPropertyDescriptors = {};

	var hasRequiredEs_object_getOwnPropertyDescriptors;

	function requireEs_object_getOwnPropertyDescriptors () {
		if (hasRequiredEs_object_getOwnPropertyDescriptors) return es_object_getOwnPropertyDescriptors;
		hasRequiredEs_object_getOwnPropertyDescriptors = 1;
		var $ = require_export();
		var DESCRIPTORS = requireDescriptors();
		var ownKeys = requireOwnKeys();
		var toIndexedObject = requireToIndexedObject();
		var getOwnPropertyDescriptorModule = requireObjectGetOwnPropertyDescriptor();
		var createProperty = requireCreateProperty();

		// `Object.getOwnPropertyDescriptors` method
		// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
		$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
		  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
		    var O = toIndexedObject(object);
		    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
		    var keys = ownKeys(O);
		    var result = {};
		    var index = 0;
		    var key, descriptor;
		    while (keys.length > index) {
		      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
		      if (descriptor !== undefined) createProperty(result, key, descriptor);
		    }
		    return result;
		  }
		});
		return es_object_getOwnPropertyDescriptors;
	}

	requireEs_object_getOwnPropertyDescriptors();

	var es_object_getOwnPropertyNames = {};

	var hasRequiredEs_object_getOwnPropertyNames;

	function requireEs_object_getOwnPropertyNames () {
		if (hasRequiredEs_object_getOwnPropertyNames) return es_object_getOwnPropertyNames;
		hasRequiredEs_object_getOwnPropertyNames = 1;
		var $ = require_export();
		var fails = requireFails();
		var getOwnPropertyNames = requireObjectGetOwnPropertyNamesExternal().f;

		// eslint-disable-next-line es/no-object-getownpropertynames -- required for testing
		var FAILS_ON_PRIMITIVES = fails(function () { return !Object.getOwnPropertyNames(1); });

		// `Object.getOwnPropertyNames` method
		// https://tc39.es/ecma262/#sec-object.getownpropertynames
		$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
		  getOwnPropertyNames: getOwnPropertyNames
		});
		return es_object_getOwnPropertyNames;
	}

	requireEs_object_getOwnPropertyNames();

	var es_object_getPrototypeOf = {};

	var hasRequiredEs_object_getPrototypeOf;

	function requireEs_object_getPrototypeOf () {
		if (hasRequiredEs_object_getPrototypeOf) return es_object_getPrototypeOf;
		hasRequiredEs_object_getPrototypeOf = 1;
		var $ = require_export();
		var fails = requireFails();
		var toObject = requireToObject();
		var nativeGetPrototypeOf = requireObjectGetPrototypeOf();
		var CORRECT_PROTOTYPE_GETTER = requireCorrectPrototypeGetter();

		var FAILS_ON_PRIMITIVES = fails(function () { nativeGetPrototypeOf(1); });

		// `Object.getPrototypeOf` method
		// https://tc39.es/ecma262/#sec-object.getprototypeof
		$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !CORRECT_PROTOTYPE_GETTER }, {
		  getPrototypeOf: function getPrototypeOf(it) {
		    return nativeGetPrototypeOf(toObject(it));
		  }
		});
		return es_object_getPrototypeOf;
	}

	requireEs_object_getPrototypeOf();

	var es_object_is = {};

	var sameValue;
	var hasRequiredSameValue;

	function requireSameValue () {
		if (hasRequiredSameValue) return sameValue;
		hasRequiredSameValue = 1;
		// `SameValue` abstract operation
		// https://tc39.es/ecma262/#sec-samevalue
		// eslint-disable-next-line es/no-object-is -- safe
		sameValue = Object.is || function is(x, y) {
		  // eslint-disable-next-line no-self-compare -- NaN check
		  return x === y ? x !== 0 || 1 / x === 1 / y : x !== x && y !== y;
		};
		return sameValue;
	}

	var hasRequiredEs_object_is;

	function requireEs_object_is () {
		if (hasRequiredEs_object_is) return es_object_is;
		hasRequiredEs_object_is = 1;
		var $ = require_export();
		var is = requireSameValue();

		// `Object.is` method
		// https://tc39.es/ecma262/#sec-object.is
		$({ target: 'Object', stat: true }, {
		  is: is
		});
		return es_object_is;
	}

	requireEs_object_is();

	var es_object_isExtensible = {};

	var hasRequiredEs_object_isExtensible;

	function requireEs_object_isExtensible () {
		if (hasRequiredEs_object_isExtensible) return es_object_isExtensible;
		hasRequiredEs_object_isExtensible = 1;
		var $ = require_export();
		var $isExtensible = requireObjectIsExtensible();

		// `Object.isExtensible` method
		// https://tc39.es/ecma262/#sec-object.isextensible
		// eslint-disable-next-line es/no-object-isextensible -- safe
		$({ target: 'Object', stat: true, forced: Object.isExtensible !== $isExtensible }, {
		  isExtensible: $isExtensible
		});
		return es_object_isExtensible;
	}

	requireEs_object_isExtensible();

	var es_object_keys = {};

	var hasRequiredEs_object_keys;

	function requireEs_object_keys () {
		if (hasRequiredEs_object_keys) return es_object_keys;
		hasRequiredEs_object_keys = 1;
		var $ = require_export();
		var toObject = requireToObject();
		var nativeKeys = requireObjectKeys();
		var fails = requireFails();

		var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

		// `Object.keys` method
		// https://tc39.es/ecma262/#sec-object.keys
		$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
		  keys: function keys(it) {
		    return nativeKeys(toObject(it));
		  }
		});
		return es_object_keys;
	}

	requireEs_object_keys();

	var es_object_toString = {};

	var objectToString;
	var hasRequiredObjectToString;

	function requireObjectToString () {
		if (hasRequiredObjectToString) return objectToString;
		hasRequiredObjectToString = 1;
		var TO_STRING_TAG_SUPPORT = requireToStringTagSupport();
		var classof = requireClassof();

		// `Object.prototype.toString` method implementation
		// https://tc39.es/ecma262/#sec-object.prototype.tostring
		objectToString = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
		  return '[object ' + classof(this) + ']';
		};
		return objectToString;
	}

	var hasRequiredEs_object_toString;

	function requireEs_object_toString () {
		if (hasRequiredEs_object_toString) return es_object_toString;
		hasRequiredEs_object_toString = 1;
		var TO_STRING_TAG_SUPPORT = requireToStringTagSupport();
		var defineBuiltIn = requireDefineBuiltIn();
		var toString = requireObjectToString();

		// `Object.prototype.toString` method
		// https://tc39.es/ecma262/#sec-object.prototype.tostring
		if (!TO_STRING_TAG_SUPPORT) {
		  defineBuiltIn(Object.prototype, 'toString', toString, { unsafe: true });
		}
		return es_object_toString;
	}

	requireEs_object_toString();

	var es_object_values = {};

	var hasRequiredEs_object_values;

	function requireEs_object_values () {
		if (hasRequiredEs_object_values) return es_object_values;
		hasRequiredEs_object_values = 1;
		var $ = require_export();
		var $values = requireObjectToArray().values;

		// `Object.values` method
		// https://tc39.es/ecma262/#sec-object.values
		$({ target: 'Object', stat: true }, {
		  values: function values(O) {
		    return $values(O);
		  }
		});
		return es_object_values;
	}

	requireEs_object_values();

	var es_promise = {};

	var es_promise_constructor = {};

	var aConstructor;
	var hasRequiredAConstructor;

	function requireAConstructor () {
		if (hasRequiredAConstructor) return aConstructor;
		hasRequiredAConstructor = 1;
		var isConstructor = requireIsConstructor();
		var tryToString = requireTryToString();

		var $TypeError = TypeError;

		// `Assert: IsConstructor(argument) is true`
		aConstructor = function (argument) {
		  if (isConstructor(argument)) return argument;
		  throw new $TypeError(tryToString(argument) + ' is not a constructor');
		};
		return aConstructor;
	}

	var speciesConstructor;
	var hasRequiredSpeciesConstructor;

	function requireSpeciesConstructor () {
		if (hasRequiredSpeciesConstructor) return speciesConstructor;
		hasRequiredSpeciesConstructor = 1;
		var anObject = requireAnObject();
		var aConstructor = requireAConstructor();
		var isNullOrUndefined = requireIsNullOrUndefined();
		var wellKnownSymbol = requireWellKnownSymbol();

		var SPECIES = wellKnownSymbol('species');

		// `SpeciesConstructor` abstract operation
		// https://tc39.es/ecma262/#sec-speciesconstructor
		speciesConstructor = function (O, defaultConstructor) {
		  var C = anObject(O).constructor;
		  var S;
		  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES]) ? defaultConstructor : aConstructor(S);
		};
		return speciesConstructor;
	}

	var validateArgumentsLength;
	var hasRequiredValidateArgumentsLength;

	function requireValidateArgumentsLength () {
		if (hasRequiredValidateArgumentsLength) return validateArgumentsLength;
		hasRequiredValidateArgumentsLength = 1;
		var $TypeError = TypeError;

		validateArgumentsLength = function (passed, required) {
		  if (passed < required) throw new $TypeError('Not enough arguments');
		  return passed;
		};
		return validateArgumentsLength;
	}

	var environmentIsIos;
	var hasRequiredEnvironmentIsIos;

	function requireEnvironmentIsIos () {
		if (hasRequiredEnvironmentIsIos) return environmentIsIos;
		hasRequiredEnvironmentIsIos = 1;
		var userAgent = requireEnvironmentUserAgent();

		// eslint-disable-next-line redos/no-vulnerable -- safe
		environmentIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);
		return environmentIsIos;
	}

	var task;
	var hasRequiredTask;

	function requireTask () {
		if (hasRequiredTask) return task;
		hasRequiredTask = 1;
		var globalThis = requireGlobalThis();
		var apply = requireFunctionApply();
		var bind = requireFunctionBindContext();
		var isCallable = requireIsCallable();
		var hasOwn = requireHasOwnProperty();
		var fails = requireFails();
		var html = requireHtml();
		var arraySlice = requireArraySlice();
		var createElement = requireDocumentCreateElement();
		var validateArgumentsLength = requireValidateArgumentsLength();
		var IS_IOS = requireEnvironmentIsIos();
		var IS_NODE = requireEnvironmentIsNode();

		var set = globalThis.setImmediate;
		var clear = globalThis.clearImmediate;
		var process = globalThis.process;
		var Dispatch = globalThis.Dispatch;
		var Function = globalThis.Function;
		var MessageChannel = globalThis.MessageChannel;
		var String = globalThis.String;
		var counter = 0;
		var queue = {};
		var ONREADYSTATECHANGE = 'onreadystatechange';
		var $location, defer, channel, port;

		fails(function () {
		  // Deno throws a ReferenceError on `location` access without `--location` flag
		  $location = globalThis.location;
		});

		var run = function (id) {
		  if (hasOwn(queue, id)) {
		    var fn = queue[id];
		    delete queue[id];
		    fn();
		  }
		};

		var runner = function (id) {
		  return function () {
		    run(id);
		  };
		};

		var eventListener = function (event) {
		  run(event.data);
		};

		var globalPostMessageDefer = function (id) {
		  // old engines have not location.origin
		  globalThis.postMessage(String(id), $location.protocol + '//' + $location.host);
		};

		// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
		if (!set || !clear) {
		  set = function setImmediate(handler) {
		    validateArgumentsLength(arguments.length, 1);
		    var fn = isCallable(handler) ? handler : Function(handler);
		    var args = arraySlice(arguments, 1);
		    queue[++counter] = function () {
		      apply(fn, undefined, args);
		    };
		    defer(counter);
		    return counter;
		  };
		  clear = function clearImmediate(id) {
		    delete queue[id];
		  };
		  // Node.js 0.8-
		  if (IS_NODE) {
		    defer = function (id) {
		      process.nextTick(runner(id));
		    };
		  // Sphere (JS game engine) Dispatch API
		  } else if (Dispatch && Dispatch.now) {
		    defer = function (id) {
		      Dispatch.now(runner(id));
		    };
		  // Browsers with MessageChannel, includes WebWorkers
		  // except iOS - https://github.com/zloirock/core-js/issues/624
		  } else if (MessageChannel && !IS_IOS) {
		    channel = new MessageChannel();
		    port = channel.port2;
		    channel.port1.onmessage = eventListener;
		    defer = bind(port.postMessage, port);
		  // Browsers with postMessage, skip WebWorkers
		  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
		  } else if (
		    globalThis.addEventListener &&
		    isCallable(globalThis.postMessage) &&
		    !globalThis.importScripts &&
		    $location && $location.protocol !== 'file:' &&
		    !fails(globalPostMessageDefer)
		  ) {
		    defer = globalPostMessageDefer;
		    globalThis.addEventListener('message', eventListener, false);
		  // IE8-
		  } else if (ONREADYSTATECHANGE in createElement('script')) {
		    defer = function (id) {
		      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
		        html.removeChild(this);
		        run(id);
		      };
		    };
		  // Rest old browsers
		  } else {
		    defer = function (id) {
		      setTimeout(runner(id), 0);
		    };
		  }
		}

		task = {
		  set: set,
		  clear: clear
		};
		return task;
	}

	var safeGetBuiltIn;
	var hasRequiredSafeGetBuiltIn;

	function requireSafeGetBuiltIn () {
		if (hasRequiredSafeGetBuiltIn) return safeGetBuiltIn;
		hasRequiredSafeGetBuiltIn = 1;
		var globalThis = requireGlobalThis();
		var DESCRIPTORS = requireDescriptors();

		// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

		// Avoid NodeJS experimental warning
		safeGetBuiltIn = function (name) {
		  if (!DESCRIPTORS) return globalThis[name];
		  var descriptor = getOwnPropertyDescriptor(globalThis, name);
		  return descriptor && descriptor.value;
		};
		return safeGetBuiltIn;
	}

	var queue;
	var hasRequiredQueue;

	function requireQueue () {
		if (hasRequiredQueue) return queue;
		hasRequiredQueue = 1;
		var Queue = function () {
		  this.head = null;
		  this.tail = null;
		};

		Queue.prototype = {
		  add: function (item) {
		    var entry = { item: item, next: null };
		    var tail = this.tail;
		    if (tail) tail.next = entry;
		    else this.head = entry;
		    this.tail = entry;
		  },
		  get: function () {
		    var entry = this.head;
		    if (entry) {
		      var next = this.head = entry.next;
		      if (next === null) this.tail = null;
		      return entry.item;
		    }
		  }
		};

		queue = Queue;
		return queue;
	}

	var environmentIsIosPebble;
	var hasRequiredEnvironmentIsIosPebble;

	function requireEnvironmentIsIosPebble () {
		if (hasRequiredEnvironmentIsIosPebble) return environmentIsIosPebble;
		hasRequiredEnvironmentIsIosPebble = 1;
		var userAgent = requireEnvironmentUserAgent();

		environmentIsIosPebble = /ipad|iphone|ipod/i.test(userAgent) && typeof Pebble != 'undefined';
		return environmentIsIosPebble;
	}

	var environmentIsWebosWebkit;
	var hasRequiredEnvironmentIsWebosWebkit;

	function requireEnvironmentIsWebosWebkit () {
		if (hasRequiredEnvironmentIsWebosWebkit) return environmentIsWebosWebkit;
		hasRequiredEnvironmentIsWebosWebkit = 1;
		var userAgent = requireEnvironmentUserAgent();

		environmentIsWebosWebkit = /web0s(?!.*chrome)/i.test(userAgent);
		return environmentIsWebosWebkit;
	}

	var microtask_1;
	var hasRequiredMicrotask;

	function requireMicrotask () {
		if (hasRequiredMicrotask) return microtask_1;
		hasRequiredMicrotask = 1;
		var globalThis = requireGlobalThis();
		var safeGetBuiltIn = requireSafeGetBuiltIn();
		var bind = requireFunctionBindContext();
		var macrotask = requireTask().set;
		var Queue = requireQueue();
		var IS_IOS = requireEnvironmentIsIos();
		var IS_IOS_PEBBLE = requireEnvironmentIsIosPebble();
		var IS_WEBOS_WEBKIT = requireEnvironmentIsWebosWebkit();
		var IS_NODE = requireEnvironmentIsNode();

		var MutationObserver = globalThis.MutationObserver || globalThis.WebKitMutationObserver;
		var document = globalThis.document;
		var process = globalThis.process;
		var Promise = globalThis.Promise;
		var microtask = safeGetBuiltIn('queueMicrotask');
		var notify, toggle, node, promise, then;

		// modern engines have queueMicrotask method
		if (!microtask) {
		  var queue = new Queue();

		  var flush = function () {
		    var parent, fn;
		    if (IS_NODE && (parent = process.domain)) parent.exit();
		    while (fn = queue.get()) try {
		      fn();
		    } catch (error) {
		      if (queue.head) notify();
		      throw error;
		    }
		    if (parent) parent.enter();
		  };

		  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
		  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
		  if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
		    toggle = true;
		    node = document.createTextNode('');
		    new MutationObserver(flush).observe(node, { characterData: true });
		    notify = function () {
		      node.data = toggle = !toggle;
		    };
		  // environments with maybe non-completely correct, but existent Promise
		  } else if (!IS_IOS_PEBBLE && Promise && Promise.resolve) {
		    // Promise.resolve without an argument throws an error in LG WebOS 2
		    promise = Promise.resolve(undefined);
		    // workaround of WebKit ~ iOS Safari 10.1 bug
		    promise.constructor = Promise;
		    then = bind(promise.then, promise);
		    notify = function () {
		      then(flush);
		    };
		  // Node.js without promises
		  } else if (IS_NODE) {
		    notify = function () {
		      process.nextTick(flush);
		    };
		  // for other environments - macrotask based on:
		  // - setImmediate
		  // - MessageChannel
		  // - window.postMessage
		  // - onreadystatechange
		  // - setTimeout
		  } else {
		    // `webpack` dev server bug on IE global methods - use bind(fn, global)
		    macrotask = bind(macrotask, globalThis);
		    notify = function () {
		      macrotask(flush);
		    };
		  }

		  microtask = function (fn) {
		    if (!queue.head) notify();
		    queue.add(fn);
		  };
		}

		microtask_1 = microtask;
		return microtask_1;
	}

	var hostReportErrors;
	var hasRequiredHostReportErrors;

	function requireHostReportErrors () {
		if (hasRequiredHostReportErrors) return hostReportErrors;
		hasRequiredHostReportErrors = 1;
		hostReportErrors = function (a, b) {
		  try {
		    // eslint-disable-next-line no-console -- safe
		    arguments.length === 1 ? console.error(a) : console.error(a, b);
		  } catch (error) { /* empty */ }
		};
		return hostReportErrors;
	}

	var perform;
	var hasRequiredPerform;

	function requirePerform () {
		if (hasRequiredPerform) return perform;
		hasRequiredPerform = 1;
		perform = function (exec) {
		  try {
		    return { error: false, value: exec() };
		  } catch (error) {
		    return { error: true, value: error };
		  }
		};
		return perform;
	}

	var promiseNativeConstructor;
	var hasRequiredPromiseNativeConstructor;

	function requirePromiseNativeConstructor () {
		if (hasRequiredPromiseNativeConstructor) return promiseNativeConstructor;
		hasRequiredPromiseNativeConstructor = 1;
		var globalThis = requireGlobalThis();

		promiseNativeConstructor = globalThis.Promise;
		return promiseNativeConstructor;
	}

	var promiseConstructorDetection;
	var hasRequiredPromiseConstructorDetection;

	function requirePromiseConstructorDetection () {
		if (hasRequiredPromiseConstructorDetection) return promiseConstructorDetection;
		hasRequiredPromiseConstructorDetection = 1;
		var globalThis = requireGlobalThis();
		var NativePromiseConstructor = requirePromiseNativeConstructor();
		var isCallable = requireIsCallable();
		var isForced = requireIsForced();
		var inspectSource = requireInspectSource();
		var wellKnownSymbol = requireWellKnownSymbol();
		var ENVIRONMENT = requireEnvironment();
		var IS_PURE = requireIsPure();
		var V8_VERSION = requireEnvironmentV8Version();

		var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
		var SPECIES = wellKnownSymbol('species');
		var SUBCLASSING = false;
		var NATIVE_PROMISE_REJECTION_EVENT = isCallable(globalThis.PromiseRejectionEvent);

		var FORCED_PROMISE_CONSTRUCTOR = isForced('Promise', function () {
		  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor);
		  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor);
		  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
		  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
		  // We can't detect it synchronously, so just check versions
		  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
		  // We need Promise#{ catch, finally } in the pure version for preventing prototype pollution
		  if (IS_PURE && !(NativePromisePrototype['catch'] && NativePromisePrototype['finally'])) return true;
		  // We can't use @@species feature detection in V8 since it causes
		  // deoptimization and performance degradation
		  // https://github.com/zloirock/core-js/issues/679
		  if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
		    // Detect correctness of subclassing with @@species support
		    var promise = new NativePromiseConstructor(function (resolve) { resolve(1); });
		    var FakePromise = function (exec) {
		      exec(function () { /* empty */ }, function () { /* empty */ });
		    };
		    var constructor = promise.constructor = {};
		    constructor[SPECIES] = FakePromise;
		    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
		    if (!SUBCLASSING) return true;
		  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
		  } return !GLOBAL_CORE_JS_PROMISE && (ENVIRONMENT === 'BROWSER' || ENVIRONMENT === 'DENO') && !NATIVE_PROMISE_REJECTION_EVENT;
		});

		promiseConstructorDetection = {
		  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
		  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
		  SUBCLASSING: SUBCLASSING
		};
		return promiseConstructorDetection;
	}

	var newPromiseCapability = {};

	var hasRequiredNewPromiseCapability;

	function requireNewPromiseCapability () {
		if (hasRequiredNewPromiseCapability) return newPromiseCapability;
		hasRequiredNewPromiseCapability = 1;
		var aCallable = requireACallable();

		var $TypeError = TypeError;

		var PromiseCapability = function (C) {
		  var resolve, reject;
		  this.promise = new C(function ($$resolve, $$reject) {
		    if (resolve !== undefined || reject !== undefined) throw new $TypeError('Bad Promise constructor');
		    resolve = $$resolve;
		    reject = $$reject;
		  });
		  this.resolve = aCallable(resolve);
		  this.reject = aCallable(reject);
		};

		// `NewPromiseCapability` abstract operation
		// https://tc39.es/ecma262/#sec-newpromisecapability
		newPromiseCapability.f = function (C) {
		  return new PromiseCapability(C);
		};
		return newPromiseCapability;
	}

	var hasRequiredEs_promise_constructor;

	function requireEs_promise_constructor () {
		if (hasRequiredEs_promise_constructor) return es_promise_constructor;
		hasRequiredEs_promise_constructor = 1;
		var $ = require_export();
		var IS_PURE = requireIsPure();
		var IS_NODE = requireEnvironmentIsNode();
		var globalThis = requireGlobalThis();
		var call = requireFunctionCall();
		var defineBuiltIn = requireDefineBuiltIn();
		var setPrototypeOf = requireObjectSetPrototypeOf();
		var setToStringTag = requireSetToStringTag();
		var setSpecies = requireSetSpecies();
		var aCallable = requireACallable();
		var isCallable = requireIsCallable();
		var isObject = requireIsObject();
		var anInstance = requireAnInstance();
		var speciesConstructor = requireSpeciesConstructor();
		var task = requireTask().set;
		var microtask = requireMicrotask();
		var hostReportErrors = requireHostReportErrors();
		var perform = requirePerform();
		var Queue = requireQueue();
		var InternalStateModule = requireInternalState();
		var NativePromiseConstructor = requirePromiseNativeConstructor();
		var PromiseConstructorDetection = requirePromiseConstructorDetection();
		var newPromiseCapabilityModule = requireNewPromiseCapability();

		var PROMISE = 'Promise';
		var FORCED_PROMISE_CONSTRUCTOR = PromiseConstructorDetection.CONSTRUCTOR;
		var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
		var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
		var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
		var setInternalState = InternalStateModule.set;
		var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
		var PromiseConstructor = NativePromiseConstructor;
		var PromisePrototype = NativePromisePrototype;
		var TypeError = globalThis.TypeError;
		var document = globalThis.document;
		var process = globalThis.process;
		var newPromiseCapability = newPromiseCapabilityModule.f;
		var newGenericPromiseCapability = newPromiseCapability;

		var DISPATCH_EVENT = !!(document && document.createEvent && globalThis.dispatchEvent);
		var UNHANDLED_REJECTION = 'unhandledrejection';
		var REJECTION_HANDLED = 'rejectionhandled';
		var PENDING = 0;
		var FULFILLED = 1;
		var REJECTED = 2;
		var HANDLED = 1;
		var UNHANDLED = 2;

		var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

		// helpers
		var isThenable = function (it) {
		  var then;
		  return isObject(it) && isCallable(then = it.then) ? then : false;
		};

		var callReaction = function (reaction, state) {
		  var value = state.value;
		  var ok = state.state === FULFILLED;
		  var handler = ok ? reaction.ok : reaction.fail;
		  var resolve = reaction.resolve;
		  var reject = reaction.reject;
		  var domain = reaction.domain;
		  var result, then, exited;
		  try {
		    if (handler) {
		      if (!ok) {
		        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
		        state.rejection = HANDLED;
		      }
		      if (handler === true) result = value;
		      else {
		        if (domain) domain.enter();
		        result = handler(value); // can throw
		        if (domain) {
		          domain.exit();
		          exited = true;
		        }
		      }
		      if (result === reaction.promise) {
		        reject(new TypeError('Promise-chain cycle'));
		      } else if (then = isThenable(result)) {
		        call(then, result, resolve, reject);
		      } else resolve(result);
		    } else reject(value);
		  } catch (error) {
		    if (domain && !exited) domain.exit();
		    reject(error);
		  }
		};

		var notify = function (state, isReject) {
		  if (state.notified) return;
		  state.notified = true;
		  microtask(function () {
		    var reactions = state.reactions;
		    var reaction;
		    while (reaction = reactions.get()) {
		      callReaction(reaction, state);
		    }
		    state.notified = false;
		    if (isReject && !state.rejection) onUnhandled(state);
		  });
		};

		var dispatchEvent = function (name, promise, reason) {
		  var event, handler;
		  if (DISPATCH_EVENT) {
		    event = document.createEvent('Event');
		    event.promise = promise;
		    event.reason = reason;
		    event.initEvent(name, false, true);
		    globalThis.dispatchEvent(event);
		  } else event = { promise: promise, reason: reason };
		  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = globalThis['on' + name])) handler(event);
		  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
		};

		var onUnhandled = function (state) {
		  call(task, globalThis, function () {
		    var promise = state.facade;
		    var value = state.value;
		    var IS_UNHANDLED = isUnhandled(state);
		    var result;
		    if (IS_UNHANDLED) {
		      result = perform(function () {
		        if (IS_NODE) {
		          process.emit('unhandledRejection', value, promise);
		        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
		      });
		      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
		      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
		      if (result.error) throw result.value;
		    }
		  });
		};

		var isUnhandled = function (state) {
		  return state.rejection !== HANDLED && !state.parent;
		};

		var onHandleUnhandled = function (state) {
		  call(task, globalThis, function () {
		    var promise = state.facade;
		    if (IS_NODE) {
		      process.emit('rejectionHandled', promise);
		    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
		  });
		};

		var bind = function (fn, state, unwrap) {
		  return function (value) {
		    fn(state, value, unwrap);
		  };
		};

		var internalReject = function (state, value, unwrap) {
		  if (state.done) return;
		  state.done = true;
		  if (unwrap) state = unwrap;
		  state.value = value;
		  state.state = REJECTED;
		  notify(state, true);
		};

		var internalResolve = function (state, value, unwrap) {
		  if (state.done) return;
		  state.done = true;
		  if (unwrap) state = unwrap;
		  try {
		    if (state.facade === value) throw new TypeError("Promise can't be resolved itself");
		    var then = isThenable(value);
		    if (then) {
		      microtask(function () {
		        var wrapper = { done: false };
		        try {
		          call(then, value,
		            bind(internalResolve, wrapper, state),
		            bind(internalReject, wrapper, state)
		          );
		        } catch (error) {
		          internalReject(wrapper, error, state);
		        }
		      });
		    } else {
		      state.value = value;
		      state.state = FULFILLED;
		      notify(state, false);
		    }
		  } catch (error) {
		    internalReject({ done: false }, error, state);
		  }
		};

		// constructor polyfill
		if (FORCED_PROMISE_CONSTRUCTOR) {
		  // 25.4.3.1 Promise(executor)
		  PromiseConstructor = function Promise(executor) {
		    anInstance(this, PromisePrototype);
		    aCallable(executor);
		    call(Internal, this);
		    var state = getInternalPromiseState(this);
		    try {
		      executor(bind(internalResolve, state), bind(internalReject, state));
		    } catch (error) {
		      internalReject(state, error);
		    }
		  };

		  PromisePrototype = PromiseConstructor.prototype;

		  // eslint-disable-next-line no-unused-vars -- required for `.length`
		  Internal = function Promise(executor) {
		    setInternalState(this, {
		      type: PROMISE,
		      done: false,
		      notified: false,
		      parent: false,
		      reactions: new Queue(),
		      rejection: false,
		      state: PENDING,
		      value: null
		    });
		  };

		  // `Promise.prototype.then` method
		  // https://tc39.es/ecma262/#sec-promise.prototype.then
		  Internal.prototype = defineBuiltIn(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
		    var state = getInternalPromiseState(this);
		    var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
		    state.parent = true;
		    reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
		    reaction.fail = isCallable(onRejected) && onRejected;
		    reaction.domain = IS_NODE ? process.domain : undefined;
		    if (state.state === PENDING) state.reactions.add(reaction);
		    else microtask(function () {
		      callReaction(reaction, state);
		    });
		    return reaction.promise;
		  });

		  OwnPromiseCapability = function () {
		    var promise = new Internal();
		    var state = getInternalPromiseState(promise);
		    this.promise = promise;
		    this.resolve = bind(internalResolve, state);
		    this.reject = bind(internalReject, state);
		  };

		  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
		    return C === PromiseConstructor || C === PromiseWrapper
		      ? new OwnPromiseCapability(C)
		      : newGenericPromiseCapability(C);
		  };

		  if (!IS_PURE && isCallable(NativePromiseConstructor) && NativePromisePrototype !== Object.prototype) {
		    nativeThen = NativePromisePrototype.then;

		    if (!NATIVE_PROMISE_SUBCLASSING) {
		      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
		      defineBuiltIn(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
		        var that = this;
		        return new PromiseConstructor(function (resolve, reject) {
		          call(nativeThen, that, resolve, reject);
		        }).then(onFulfilled, onRejected);
		      // https://github.com/zloirock/core-js/issues/640
		      }, { unsafe: true });
		    }

		    // make `.constructor === Promise` work for native promise-based APIs
		    try {
		      delete NativePromisePrototype.constructor;
		    } catch (error) { /* empty */ }

		    // make `instanceof Promise` work for native promise-based APIs
		    if (setPrototypeOf) {
		      setPrototypeOf(NativePromisePrototype, PromisePrototype);
		    }
		  }
		}

		// `Promise` constructor
		// https://tc39.es/ecma262/#sec-promise-executor
		$({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
		  Promise: PromiseConstructor
		});

		setToStringTag(PromiseConstructor, PROMISE, false, true);
		setSpecies(PROMISE);
		return es_promise_constructor;
	}

	var es_promise_all = {};

	var promiseStaticsIncorrectIteration;
	var hasRequiredPromiseStaticsIncorrectIteration;

	function requirePromiseStaticsIncorrectIteration () {
		if (hasRequiredPromiseStaticsIncorrectIteration) return promiseStaticsIncorrectIteration;
		hasRequiredPromiseStaticsIncorrectIteration = 1;
		var NativePromiseConstructor = requirePromiseNativeConstructor();
		var checkCorrectnessOfIteration = requireCheckCorrectnessOfIteration();
		var FORCED_PROMISE_CONSTRUCTOR = requirePromiseConstructorDetection().CONSTRUCTOR;

		promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR || !checkCorrectnessOfIteration(function (iterable) {
		  NativePromiseConstructor.all(iterable).then(undefined, function () { /* empty */ });
		});
		return promiseStaticsIncorrectIteration;
	}

	var hasRequiredEs_promise_all;

	function requireEs_promise_all () {
		if (hasRequiredEs_promise_all) return es_promise_all;
		hasRequiredEs_promise_all = 1;
		var $ = require_export();
		var call = requireFunctionCall();
		var aCallable = requireACallable();
		var newPromiseCapabilityModule = requireNewPromiseCapability();
		var perform = requirePerform();
		var iterate = requireIterate();
		var PROMISE_STATICS_INCORRECT_ITERATION = requirePromiseStaticsIncorrectIteration();

		// `Promise.all` method
		// https://tc39.es/ecma262/#sec-promise.all
		$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
		  all: function all(iterable) {
		    var C = this;
		    var capability = newPromiseCapabilityModule.f(C);
		    var resolve = capability.resolve;
		    var reject = capability.reject;
		    var result = perform(function () {
		      var $promiseResolve = aCallable(C.resolve);
		      var values = [];
		      var counter = 0;
		      var remaining = 1;
		      iterate(iterable, function (promise) {
		        var index = counter++;
		        var alreadyCalled = false;
		        remaining++;
		        call($promiseResolve, C, promise).then(function (value) {
		          if (alreadyCalled) return;
		          alreadyCalled = true;
		          values[index] = value;
		          --remaining || resolve(values);
		        }, reject);
		      });
		      --remaining || resolve(values);
		    });
		    if (result.error) reject(result.value);
		    return capability.promise;
		  }
		});
		return es_promise_all;
	}

	var es_promise_catch = {};

	var hasRequiredEs_promise_catch;

	function requireEs_promise_catch () {
		if (hasRequiredEs_promise_catch) return es_promise_catch;
		hasRequiredEs_promise_catch = 1;
		var $ = require_export();
		var IS_PURE = requireIsPure();
		var FORCED_PROMISE_CONSTRUCTOR = requirePromiseConstructorDetection().CONSTRUCTOR;
		var NativePromiseConstructor = requirePromiseNativeConstructor();
		var getBuiltIn = requireGetBuiltIn();
		var isCallable = requireIsCallable();
		var defineBuiltIn = requireDefineBuiltIn();

		var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

		// `Promise.prototype.catch` method
		// https://tc39.es/ecma262/#sec-promise.prototype.catch
		$({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR, real: true }, {
		  'catch': function (onRejected) {
		    return this.then(undefined, onRejected);
		  }
		});

		// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
		if (!IS_PURE && isCallable(NativePromiseConstructor)) {
		  var method = getBuiltIn('Promise').prototype['catch'];
		  if (NativePromisePrototype['catch'] !== method) {
		    defineBuiltIn(NativePromisePrototype, 'catch', method, { unsafe: true });
		  }
		}
		return es_promise_catch;
	}

	var es_promise_race = {};

	var hasRequiredEs_promise_race;

	function requireEs_promise_race () {
		if (hasRequiredEs_promise_race) return es_promise_race;
		hasRequiredEs_promise_race = 1;
		var $ = require_export();
		var call = requireFunctionCall();
		var aCallable = requireACallable();
		var newPromiseCapabilityModule = requireNewPromiseCapability();
		var perform = requirePerform();
		var iterate = requireIterate();
		var PROMISE_STATICS_INCORRECT_ITERATION = requirePromiseStaticsIncorrectIteration();

		// `Promise.race` method
		// https://tc39.es/ecma262/#sec-promise.race
		$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
		  race: function race(iterable) {
		    var C = this;
		    var capability = newPromiseCapabilityModule.f(C);
		    var reject = capability.reject;
		    var result = perform(function () {
		      var $promiseResolve = aCallable(C.resolve);
		      iterate(iterable, function (promise) {
		        call($promiseResolve, C, promise).then(capability.resolve, reject);
		      });
		    });
		    if (result.error) reject(result.value);
		    return capability.promise;
		  }
		});
		return es_promise_race;
	}

	var es_promise_reject = {};

	var hasRequiredEs_promise_reject;

	function requireEs_promise_reject () {
		if (hasRequiredEs_promise_reject) return es_promise_reject;
		hasRequiredEs_promise_reject = 1;
		var $ = require_export();
		var newPromiseCapabilityModule = requireNewPromiseCapability();
		var FORCED_PROMISE_CONSTRUCTOR = requirePromiseConstructorDetection().CONSTRUCTOR;

		// `Promise.reject` method
		// https://tc39.es/ecma262/#sec-promise.reject
		$({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
		  reject: function reject(r) {
		    var capability = newPromiseCapabilityModule.f(this);
		    var capabilityReject = capability.reject;
		    capabilityReject(r);
		    return capability.promise;
		  }
		});
		return es_promise_reject;
	}

	var es_promise_resolve = {};

	var promiseResolve;
	var hasRequiredPromiseResolve;

	function requirePromiseResolve () {
		if (hasRequiredPromiseResolve) return promiseResolve;
		hasRequiredPromiseResolve = 1;
		var anObject = requireAnObject();
		var isObject = requireIsObject();
		var newPromiseCapability = requireNewPromiseCapability();

		promiseResolve = function (C, x) {
		  anObject(C);
		  if (isObject(x) && x.constructor === C) return x;
		  var promiseCapability = newPromiseCapability.f(C);
		  var resolve = promiseCapability.resolve;
		  resolve(x);
		  return promiseCapability.promise;
		};
		return promiseResolve;
	}

	var hasRequiredEs_promise_resolve;

	function requireEs_promise_resolve () {
		if (hasRequiredEs_promise_resolve) return es_promise_resolve;
		hasRequiredEs_promise_resolve = 1;
		var $ = require_export();
		var getBuiltIn = requireGetBuiltIn();
		var IS_PURE = requireIsPure();
		var NativePromiseConstructor = requirePromiseNativeConstructor();
		var FORCED_PROMISE_CONSTRUCTOR = requirePromiseConstructorDetection().CONSTRUCTOR;
		var promiseResolve = requirePromiseResolve();

		var PromiseConstructorWrapper = getBuiltIn('Promise');
		var CHECK_WRAPPER = IS_PURE && !FORCED_PROMISE_CONSTRUCTOR;

		// `Promise.resolve` method
		// https://tc39.es/ecma262/#sec-promise.resolve
		$({ target: 'Promise', stat: true, forced: IS_PURE || FORCED_PROMISE_CONSTRUCTOR }, {
		  resolve: function resolve(x) {
		    return promiseResolve(CHECK_WRAPPER && this === PromiseConstructorWrapper ? NativePromiseConstructor : this, x);
		  }
		});
		return es_promise_resolve;
	}

	var hasRequiredEs_promise;

	function requireEs_promise () {
		if (hasRequiredEs_promise) return es_promise;
		hasRequiredEs_promise = 1;
		// TODO: Remove this module from `core-js@4` since it's split to modules listed below
		requireEs_promise_constructor();
		requireEs_promise_all();
		requireEs_promise_catch();
		requireEs_promise_race();
		requireEs_promise_reject();
		requireEs_promise_resolve();
		return es_promise;
	}

	requireEs_promise();

	var es_promise_allSettled = {};

	var hasRequiredEs_promise_allSettled;

	function requireEs_promise_allSettled () {
		if (hasRequiredEs_promise_allSettled) return es_promise_allSettled;
		hasRequiredEs_promise_allSettled = 1;
		var $ = require_export();
		var call = requireFunctionCall();
		var aCallable = requireACallable();
		var newPromiseCapabilityModule = requireNewPromiseCapability();
		var perform = requirePerform();
		var iterate = requireIterate();
		var PROMISE_STATICS_INCORRECT_ITERATION = requirePromiseStaticsIncorrectIteration();

		// `Promise.allSettled` method
		// https://tc39.es/ecma262/#sec-promise.allsettled
		$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
		  allSettled: function allSettled(iterable) {
		    var C = this;
		    var capability = newPromiseCapabilityModule.f(C);
		    var resolve = capability.resolve;
		    var reject = capability.reject;
		    var result = perform(function () {
		      var promiseResolve = aCallable(C.resolve);
		      var values = [];
		      var counter = 0;
		      var remaining = 1;
		      iterate(iterable, function (promise) {
		        var index = counter++;
		        var alreadyCalled = false;
		        remaining++;
		        call(promiseResolve, C, promise).then(function (value) {
		          if (alreadyCalled) return;
		          alreadyCalled = true;
		          values[index] = { status: 'fulfilled', value: value };
		          --remaining || resolve(values);
		        }, function (error) {
		          if (alreadyCalled) return;
		          alreadyCalled = true;
		          values[index] = { status: 'rejected', reason: error };
		          --remaining || resolve(values);
		        });
		      });
		      --remaining || resolve(values);
		    });
		    if (result.error) reject(result.value);
		    return capability.promise;
		  }
		});
		return es_promise_allSettled;
	}

	requireEs_promise_allSettled();

	var es_reflect_apply = {};

	var hasRequiredEs_reflect_apply;

	function requireEs_reflect_apply () {
		if (hasRequiredEs_reflect_apply) return es_reflect_apply;
		hasRequiredEs_reflect_apply = 1;
		var $ = require_export();
		var functionApply = requireFunctionApply();
		var aCallable = requireACallable();
		var anObject = requireAnObject();
		var fails = requireFails();

		// MS Edge argumentsList argument is optional
		var OPTIONAL_ARGUMENTS_LIST = !fails(function () {
		  // eslint-disable-next-line es/no-reflect -- required for testing
		  Reflect.apply(function () { /* empty */ });
		});

		// `Reflect.apply` method
		// https://tc39.es/ecma262/#sec-reflect.apply
		$({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
		  apply: function apply(target, thisArgument, argumentsList) {
		    return functionApply(aCallable(target), thisArgument, anObject(argumentsList));
		  }
		});
		return es_reflect_apply;
	}

	requireEs_reflect_apply();

	var es_reflect_construct = {};

	var functionBind;
	var hasRequiredFunctionBind;

	function requireFunctionBind () {
		if (hasRequiredFunctionBind) return functionBind;
		hasRequiredFunctionBind = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var aCallable = requireACallable();
		var isObject = requireIsObject();
		var hasOwn = requireHasOwnProperty();
		var arraySlice = requireArraySlice();
		var NATIVE_BIND = requireFunctionBindNative();

		var $Function = Function;
		var concat = uncurryThis([].concat);
		var join = uncurryThis([].join);
		var factories = {};

		var construct = function (C, argsLength, args) {
		  if (!hasOwn(factories, argsLength)) {
		    var list = [];
		    var i = 0;
		    for (; i < argsLength; i++) list[i] = 'a[' + i + ']';
		    factories[argsLength] = $Function('C,a', 'return new C(' + join(list, ',') + ')');
		  } return factories[argsLength](C, args);
		};

		// `Function.prototype.bind` method implementation
		// https://tc39.es/ecma262/#sec-function.prototype.bind
		// eslint-disable-next-line es/no-function-prototype-bind -- detection
		functionBind = NATIVE_BIND ? $Function.bind : function bind(that /* , ...args */) {
		  var F = aCallable(this);
		  var Prototype = F.prototype;
		  var partArgs = arraySlice(arguments, 1);
		  var boundFunction = function bound(/* args... */) {
		    var args = concat(partArgs, arraySlice(arguments));
		    return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
		  };
		  if (isObject(Prototype)) boundFunction.prototype = Prototype;
		  return boundFunction;
		};
		return functionBind;
	}

	var hasRequiredEs_reflect_construct;

	function requireEs_reflect_construct () {
		if (hasRequiredEs_reflect_construct) return es_reflect_construct;
		hasRequiredEs_reflect_construct = 1;
		var $ = require_export();
		var getBuiltIn = requireGetBuiltIn();
		var apply = requireFunctionApply();
		var bind = requireFunctionBind();
		var aConstructor = requireAConstructor();
		var anObject = requireAnObject();
		var isObject = requireIsObject();
		var create = requireObjectCreate();
		var fails = requireFails();

		var nativeConstruct = getBuiltIn('Reflect', 'construct');
		var ObjectPrototype = Object.prototype;
		var push = [].push;

		// `Reflect.construct` method
		// https://tc39.es/ecma262/#sec-reflect.construct
		// MS Edge supports only 2 arguments and argumentsList argument is optional
		// FF Nightly sets third argument as `new.target`, but does not create `this` from it
		var NEW_TARGET_BUG = fails(function () {
		  function F() { /* empty */ }
		  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
		});

		var ARGS_BUG = !fails(function () {
		  nativeConstruct(function () { /* empty */ });
		});

		var FORCED = NEW_TARGET_BUG || ARGS_BUG;

		$({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
		  construct: function construct(Target, args /* , newTarget */) {
		    aConstructor(Target);
		    anObject(args);
		    var newTarget = arguments.length < 3 ? Target : aConstructor(arguments[2]);
		    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
		    if (Target === newTarget) {
		      // w/o altered newTarget, optimization for 0-4 arguments
		      switch (args.length) {
		        case 0: return new Target();
		        case 1: return new Target(args[0]);
		        case 2: return new Target(args[0], args[1]);
		        case 3: return new Target(args[0], args[1], args[2]);
		        case 4: return new Target(args[0], args[1], args[2], args[3]);
		      }
		      // w/o altered newTarget, lot of arguments case
		      var $args = [null];
		      apply(push, $args, args);
		      return new (apply(bind, Target, $args))();
		    }
		    // with altered newTarget, not support built-in constructors
		    var proto = newTarget.prototype;
		    var instance = create(isObject(proto) ? proto : ObjectPrototype);
		    var result = apply(Target, instance, args);
		    return isObject(result) ? result : instance;
		  }
		});
		return es_reflect_construct;
	}

	requireEs_reflect_construct();

	var es_reflect_defineProperty = {};

	var hasRequiredEs_reflect_defineProperty;

	function requireEs_reflect_defineProperty () {
		if (hasRequiredEs_reflect_defineProperty) return es_reflect_defineProperty;
		hasRequiredEs_reflect_defineProperty = 1;
		var $ = require_export();
		var DESCRIPTORS = requireDescriptors();
		var anObject = requireAnObject();
		var toPropertyKey = requireToPropertyKey();
		var definePropertyModule = requireObjectDefineProperty();
		var fails = requireFails();

		// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
		var ERROR_INSTEAD_OF_FALSE = fails(function () {
		  // eslint-disable-next-line es/no-reflect -- required for testing
		  Reflect.defineProperty(definePropertyModule.f({}, 1, { value: 1 }), 1, { value: 2 });
		});

		// `Reflect.defineProperty` method
		// https://tc39.es/ecma262/#sec-reflect.defineproperty
		$({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !DESCRIPTORS }, {
		  defineProperty: function defineProperty(target, propertyKey, attributes) {
		    anObject(target);
		    var key = toPropertyKey(propertyKey);
		    anObject(attributes);
		    try {
		      definePropertyModule.f(target, key, attributes);
		      return true;
		    } catch (error) {
		      return false;
		    }
		  }
		});
		return es_reflect_defineProperty;
	}

	requireEs_reflect_defineProperty();

	var es_reflect_deleteProperty = {};

	var hasRequiredEs_reflect_deleteProperty;

	function requireEs_reflect_deleteProperty () {
		if (hasRequiredEs_reflect_deleteProperty) return es_reflect_deleteProperty;
		hasRequiredEs_reflect_deleteProperty = 1;
		var $ = require_export();
		var anObject = requireAnObject();
		var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;

		// `Reflect.deleteProperty` method
		// https://tc39.es/ecma262/#sec-reflect.deleteproperty
		$({ target: 'Reflect', stat: true }, {
		  deleteProperty: function deleteProperty(target, propertyKey) {
		    var descriptor = getOwnPropertyDescriptor(anObject(target), propertyKey);
		    return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
		  }
		});
		return es_reflect_deleteProperty;
	}

	requireEs_reflect_deleteProperty();

	var es_reflect_get = {};

	var isDataDescriptor;
	var hasRequiredIsDataDescriptor;

	function requireIsDataDescriptor () {
		if (hasRequiredIsDataDescriptor) return isDataDescriptor;
		hasRequiredIsDataDescriptor = 1;
		var hasOwn = requireHasOwnProperty();

		isDataDescriptor = function (descriptor) {
		  return descriptor !== undefined && (hasOwn(descriptor, 'value') || hasOwn(descriptor, 'writable'));
		};
		return isDataDescriptor;
	}

	var hasRequiredEs_reflect_get;

	function requireEs_reflect_get () {
		if (hasRequiredEs_reflect_get) return es_reflect_get;
		hasRequiredEs_reflect_get = 1;
		var $ = require_export();
		var call = requireFunctionCall();
		var isObject = requireIsObject();
		var anObject = requireAnObject();
		var isDataDescriptor = requireIsDataDescriptor();
		var getOwnPropertyDescriptorModule = requireObjectGetOwnPropertyDescriptor();
		var getPrototypeOf = requireObjectGetPrototypeOf();

		// `Reflect.get` method
		// https://tc39.es/ecma262/#sec-reflect.get
		function get(target, propertyKey /* , receiver */) {
		  var receiver = arguments.length < 3 ? target : arguments[2];
		  var descriptor, prototype;
		  if (anObject(target) === receiver) return target[propertyKey];
		  descriptor = getOwnPropertyDescriptorModule.f(target, propertyKey);
		  if (descriptor) return isDataDescriptor(descriptor)
		    ? descriptor.value
		    : descriptor.get === undefined ? undefined : call(descriptor.get, receiver);
		  if (isObject(prototype = getPrototypeOf(target))) return get(prototype, propertyKey, receiver);
		}

		$({ target: 'Reflect', stat: true }, {
		  get: get
		});
		return es_reflect_get;
	}

	requireEs_reflect_get();

	var es_reflect_getPrototypeOf = {};

	var hasRequiredEs_reflect_getPrototypeOf;

	function requireEs_reflect_getPrototypeOf () {
		if (hasRequiredEs_reflect_getPrototypeOf) return es_reflect_getPrototypeOf;
		hasRequiredEs_reflect_getPrototypeOf = 1;
		var $ = require_export();
		var anObject = requireAnObject();
		var objectGetPrototypeOf = requireObjectGetPrototypeOf();
		var CORRECT_PROTOTYPE_GETTER = requireCorrectPrototypeGetter();

		// `Reflect.getPrototypeOf` method
		// https://tc39.es/ecma262/#sec-reflect.getprototypeof
		$({ target: 'Reflect', stat: true, sham: !CORRECT_PROTOTYPE_GETTER }, {
		  getPrototypeOf: function getPrototypeOf(target) {
		    return objectGetPrototypeOf(anObject(target));
		  }
		});
		return es_reflect_getPrototypeOf;
	}

	requireEs_reflect_getPrototypeOf();

	var es_reflect_has = {};

	var hasRequiredEs_reflect_has;

	function requireEs_reflect_has () {
		if (hasRequiredEs_reflect_has) return es_reflect_has;
		hasRequiredEs_reflect_has = 1;
		var $ = require_export();

		// `Reflect.has` method
		// https://tc39.es/ecma262/#sec-reflect.has
		$({ target: 'Reflect', stat: true }, {
		  has: function has(target, propertyKey) {
		    return propertyKey in target;
		  }
		});
		return es_reflect_has;
	}

	requireEs_reflect_has();

	var es_reflect_ownKeys = {};

	var hasRequiredEs_reflect_ownKeys;

	function requireEs_reflect_ownKeys () {
		if (hasRequiredEs_reflect_ownKeys) return es_reflect_ownKeys;
		hasRequiredEs_reflect_ownKeys = 1;
		var $ = require_export();
		var ownKeys = requireOwnKeys();

		// `Reflect.ownKeys` method
		// https://tc39.es/ecma262/#sec-reflect.ownkeys
		$({ target: 'Reflect', stat: true }, {
		  ownKeys: ownKeys
		});
		return es_reflect_ownKeys;
	}

	requireEs_reflect_ownKeys();

	var es_reflect_set = {};

	var hasRequiredEs_reflect_set;

	function requireEs_reflect_set () {
		if (hasRequiredEs_reflect_set) return es_reflect_set;
		hasRequiredEs_reflect_set = 1;
		var $ = require_export();
		var call = requireFunctionCall();
		var anObject = requireAnObject();
		var isObject = requireIsObject();
		var isDataDescriptor = requireIsDataDescriptor();
		var fails = requireFails();
		var definePropertyModule = requireObjectDefineProperty();
		var getOwnPropertyDescriptorModule = requireObjectGetOwnPropertyDescriptor();
		var getPrototypeOf = requireObjectGetPrototypeOf();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();

		// `Reflect.set` method
		// https://tc39.es/ecma262/#sec-reflect.set
		function set(target, propertyKey, V /* , receiver */) {
		  var receiver = arguments.length < 4 ? target : arguments[3];
		  var ownDescriptor = getOwnPropertyDescriptorModule.f(anObject(target), propertyKey);
		  var existingDescriptor, prototype, setter;
		  if (!ownDescriptor) {
		    if (isObject(prototype = getPrototypeOf(target))) {
		      return set(prototype, propertyKey, V, receiver);
		    }
		    ownDescriptor = createPropertyDescriptor(0);
		  }
		  if (isDataDescriptor(ownDescriptor)) {
		    if (ownDescriptor.writable === false || !isObject(receiver)) return false;
		    if (existingDescriptor = getOwnPropertyDescriptorModule.f(receiver, propertyKey)) {
		      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
		      existingDescriptor.value = V;
		      definePropertyModule.f(receiver, propertyKey, existingDescriptor);
		    } else definePropertyModule.f(receiver, propertyKey, createPropertyDescriptor(0, V));
		  } else {
		    setter = ownDescriptor.set;
		    if (setter === undefined) return false;
		    call(setter, receiver, V);
		  } return true;
		}

		// MS Edge 17-18 Reflect.set allows setting the property to object
		// with non-writable property on the prototype
		var MS_EDGE_BUG = fails(function () {
		  var Constructor = function () { /* empty */ };
		  var object = definePropertyModule.f(new Constructor(), 'a', { configurable: true });
		  // eslint-disable-next-line es/no-reflect -- required for testing
		  return Reflect.set(Constructor.prototype, 'a', 1, object) !== false;
		});

		$({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
		  set: set
		});
		return es_reflect_set;
	}

	requireEs_reflect_set();

	var es_regexp_constructor = {};

	var isRegexp;
	var hasRequiredIsRegexp;

	function requireIsRegexp () {
		if (hasRequiredIsRegexp) return isRegexp;
		hasRequiredIsRegexp = 1;
		var isObject = requireIsObject();
		var classof = requireClassofRaw();
		var wellKnownSymbol = requireWellKnownSymbol();

		var MATCH = wellKnownSymbol('match');

		// `IsRegExp` abstract operation
		// https://tc39.es/ecma262/#sec-isregexp
		isRegexp = function (it) {
		  var isRegExp;
		  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) === 'RegExp');
		};
		return isRegexp;
	}

	var regexpFlags;
	var hasRequiredRegexpFlags;

	function requireRegexpFlags () {
		if (hasRequiredRegexpFlags) return regexpFlags;
		hasRequiredRegexpFlags = 1;
		var anObject = requireAnObject();

		// `RegExp.prototype.flags` getter implementation
		// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
		regexpFlags = function () {
		  var that = anObject(this);
		  var result = '';
		  if (that.hasIndices) result += 'd';
		  if (that.global) result += 'g';
		  if (that.ignoreCase) result += 'i';
		  if (that.multiline) result += 'm';
		  if (that.dotAll) result += 's';
		  if (that.unicode) result += 'u';
		  if (that.unicodeSets) result += 'v';
		  if (that.sticky) result += 'y';
		  return result;
		};
		return regexpFlags;
	}

	var regexpGetFlags;
	var hasRequiredRegexpGetFlags;

	function requireRegexpGetFlags () {
		if (hasRequiredRegexpGetFlags) return regexpGetFlags;
		hasRequiredRegexpGetFlags = 1;
		var call = requireFunctionCall();
		var hasOwn = requireHasOwnProperty();
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var regExpFlags = requireRegexpFlags();

		var RegExpPrototype = RegExp.prototype;

		regexpGetFlags = function (R) {
		  var flags = R.flags;
		  return flags === undefined && !('flags' in RegExpPrototype) && !hasOwn(R, 'flags') && isPrototypeOf(RegExpPrototype, R)
		    ? call(regExpFlags, R) : flags;
		};
		return regexpGetFlags;
	}

	var regexpStickyHelpers;
	var hasRequiredRegexpStickyHelpers;

	function requireRegexpStickyHelpers () {
		if (hasRequiredRegexpStickyHelpers) return regexpStickyHelpers;
		hasRequiredRegexpStickyHelpers = 1;
		var fails = requireFails();
		var globalThis = requireGlobalThis();

		// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
		var $RegExp = globalThis.RegExp;

		var UNSUPPORTED_Y = fails(function () {
		  var re = $RegExp('a', 'y');
		  re.lastIndex = 2;
		  return re.exec('abcd') !== null;
		});

		// UC Browser bug
		// https://github.com/zloirock/core-js/issues/1008
		var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
		  return !$RegExp('a', 'y').sticky;
		});

		var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
		  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
		  var re = $RegExp('^r', 'gy');
		  re.lastIndex = 2;
		  return re.exec('str') !== null;
		});

		regexpStickyHelpers = {
		  BROKEN_CARET: BROKEN_CARET,
		  MISSED_STICKY: MISSED_STICKY,
		  UNSUPPORTED_Y: UNSUPPORTED_Y
		};
		return regexpStickyHelpers;
	}

	var regexpUnsupportedDotAll;
	var hasRequiredRegexpUnsupportedDotAll;

	function requireRegexpUnsupportedDotAll () {
		if (hasRequiredRegexpUnsupportedDotAll) return regexpUnsupportedDotAll;
		hasRequiredRegexpUnsupportedDotAll = 1;
		var fails = requireFails();
		var globalThis = requireGlobalThis();

		// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
		var $RegExp = globalThis.RegExp;

		regexpUnsupportedDotAll = fails(function () {
		  var re = $RegExp('.', 's');
		  return !(re.dotAll && re.test('\n') && re.flags === 's');
		});
		return regexpUnsupportedDotAll;
	}

	var regexpUnsupportedNcg;
	var hasRequiredRegexpUnsupportedNcg;

	function requireRegexpUnsupportedNcg () {
		if (hasRequiredRegexpUnsupportedNcg) return regexpUnsupportedNcg;
		hasRequiredRegexpUnsupportedNcg = 1;
		var fails = requireFails();
		var globalThis = requireGlobalThis();

		// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
		var $RegExp = globalThis.RegExp;

		regexpUnsupportedNcg = fails(function () {
		  var re = $RegExp('(?<a>b)', 'g');
		  return re.exec('b').groups.a !== 'b' ||
		    'b'.replace(re, '$<a>c') !== 'bc';
		});
		return regexpUnsupportedNcg;
	}

	var hasRequiredEs_regexp_constructor;

	function requireEs_regexp_constructor () {
		if (hasRequiredEs_regexp_constructor) return es_regexp_constructor;
		hasRequiredEs_regexp_constructor = 1;
		var DESCRIPTORS = requireDescriptors();
		var globalThis = requireGlobalThis();
		var uncurryThis = requireFunctionUncurryThis();
		var isForced = requireIsForced();
		var inheritIfRequired = requireInheritIfRequired();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var create = requireObjectCreate();
		var getOwnPropertyNames = requireObjectGetOwnPropertyNames().f;
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var isRegExp = requireIsRegexp();
		var toString = requireToString();
		var getRegExpFlags = requireRegexpGetFlags();
		var stickyHelpers = requireRegexpStickyHelpers();
		var proxyAccessor = requireProxyAccessor();
		var defineBuiltIn = requireDefineBuiltIn();
		var fails = requireFails();
		var hasOwn = requireHasOwnProperty();
		var enforceInternalState = requireInternalState().enforce;
		var setSpecies = requireSetSpecies();
		var wellKnownSymbol = requireWellKnownSymbol();
		var UNSUPPORTED_DOT_ALL = requireRegexpUnsupportedDotAll();
		var UNSUPPORTED_NCG = requireRegexpUnsupportedNcg();

		var MATCH = wellKnownSymbol('match');
		var NativeRegExp = globalThis.RegExp;
		var RegExpPrototype = NativeRegExp.prototype;
		var SyntaxError = globalThis.SyntaxError;
		var exec = uncurryThis(RegExpPrototype.exec);
		var charAt = uncurryThis(''.charAt);
		var replace = uncurryThis(''.replace);
		var stringIndexOf = uncurryThis(''.indexOf);
		var stringSlice = uncurryThis(''.slice);
		// TODO: Use only proper RegExpIdentifierName
		var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
		var re1 = /a/g;
		var re2 = /a/g;

		// "new" should create a new object, old webkit bug
		var CORRECT_NEW = new NativeRegExp(re1) !== re1;

		var MISSED_STICKY = stickyHelpers.MISSED_STICKY;
		var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;

		var BASE_FORCED = DESCRIPTORS &&
		  (!CORRECT_NEW || MISSED_STICKY || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG || fails(function () {
		    re2[MATCH] = false;
		    // RegExp constructor can alter flags and IsRegExp works correct with @@match
		    // eslint-disable-next-line sonarjs/inconsistent-function-call -- required for testing
		    return NativeRegExp(re1) !== re1 || NativeRegExp(re2) === re2 || String(NativeRegExp(re1, 'i')) !== '/a/i';
		  }));

		var handleDotAll = function (string) {
		  var length = string.length;
		  var index = 0;
		  var result = '';
		  var brackets = false;
		  var chr;
		  for (; index <= length; index++) {
		    chr = charAt(string, index);
		    if (chr === '\\') {
		      result += chr + charAt(string, ++index);
		      continue;
		    }
		    if (!brackets && chr === '.') {
		      result += '[\\s\\S]';
		    } else {
		      if (chr === '[') {
		        brackets = true;
		      } else if (chr === ']') {
		        brackets = false;
		      } result += chr;
		    }
		  } return result;
		};

		var handleNCG = function (string) {
		  var length = string.length;
		  var index = 0;
		  var result = '';
		  var named = [];
		  var names = create(null);
		  var brackets = false;
		  var ncg = false;
		  var groupid = 0;
		  var groupname = '';
		  var chr;
		  for (; index <= length; index++) {
		    chr = charAt(string, index);
		    if (chr === '\\') {
		      chr += charAt(string, ++index);
		    } else if (chr === ']') {
		      brackets = false;
		    } else if (!brackets) switch (true) {
		      case chr === '[':
		        brackets = true;
		        break;
		      case chr === '(':
		        result += chr;
		        // ignore non-capturing groups
		        if (stringSlice(string, index + 1, index + 3) === '?:') {
		          continue;
		        }
		        if (exec(IS_NCG, stringSlice(string, index + 1))) {
		          index += 2;
		          ncg = true;
		        }
		        groupid++;
		        continue;
		      case chr === '>' && ncg:
		        if (groupname === '' || hasOwn(names, groupname)) {
		          throw new SyntaxError('Invalid capture group name');
		        }
		        names[groupname] = true;
		        named[named.length] = [groupname, groupid];
		        ncg = false;
		        groupname = '';
		        continue;
		    }
		    if (ncg) groupname += chr;
		    else result += chr;
		  } return [result, named];
		};

		// `RegExp` constructor
		// https://tc39.es/ecma262/#sec-regexp-constructor
		if (isForced('RegExp', BASE_FORCED)) {
		  var RegExpWrapper = function RegExp(pattern, flags) {
		    var thisIsRegExp = isPrototypeOf(RegExpPrototype, this);
		    var patternIsRegExp = isRegExp(pattern);
		    var flagsAreUndefined = flags === undefined;
		    var groups = [];
		    var rawPattern = pattern;
		    var rawFlags, dotAll, sticky, handled, result, state;

		    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
		      return pattern;
		    }

		    if (patternIsRegExp || isPrototypeOf(RegExpPrototype, pattern)) {
		      pattern = pattern.source;
		      if (flagsAreUndefined) flags = getRegExpFlags(rawPattern);
		    }

		    pattern = pattern === undefined ? '' : toString(pattern);
		    flags = flags === undefined ? '' : toString(flags);
		    rawPattern = pattern;

		    if (UNSUPPORTED_DOT_ALL && 'dotAll' in re1) {
		      dotAll = !!flags && stringIndexOf(flags, 's') > -1;
		      if (dotAll) flags = replace(flags, /s/g, '');
		    }

		    rawFlags = flags;

		    if (MISSED_STICKY && 'sticky' in re1) {
		      sticky = !!flags && stringIndexOf(flags, 'y') > -1;
		      if (sticky && UNSUPPORTED_Y) flags = replace(flags, /y/g, '');
		    }

		    if (UNSUPPORTED_NCG) {
		      handled = handleNCG(pattern);
		      pattern = handled[0];
		      groups = handled[1];
		    }

		    result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype, RegExpWrapper);

		    if (dotAll || sticky || groups.length) {
		      state = enforceInternalState(result);
		      if (dotAll) {
		        state.dotAll = true;
		        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
		      }
		      if (sticky) state.sticky = true;
		      if (groups.length) state.groups = groups;
		    }

		    if (pattern !== rawPattern) try {
		      // fails in old engines, but we have no alternatives for unsupported regex syntax
		      createNonEnumerableProperty(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
		    } catch (error) { /* empty */ }

		    return result;
		  };

		  for (var keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index;) {
		    proxyAccessor(RegExpWrapper, NativeRegExp, keys[index++]);
		  }

		  RegExpPrototype.constructor = RegExpWrapper;
		  RegExpWrapper.prototype = RegExpPrototype;
		  defineBuiltIn(globalThis, 'RegExp', RegExpWrapper, { constructor: true });
		}

		// https://tc39.es/ecma262/#sec-get-regexp-@@species
		setSpecies('RegExp');
		return es_regexp_constructor;
	}

	requireEs_regexp_constructor();

	var es_regexp_dotAll = {};

	var hasRequiredEs_regexp_dotAll;

	function requireEs_regexp_dotAll () {
		if (hasRequiredEs_regexp_dotAll) return es_regexp_dotAll;
		hasRequiredEs_regexp_dotAll = 1;
		var DESCRIPTORS = requireDescriptors();
		var UNSUPPORTED_DOT_ALL = requireRegexpUnsupportedDotAll();
		var classof = requireClassofRaw();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var getInternalState = requireInternalState().get;

		var RegExpPrototype = RegExp.prototype;
		var $TypeError = TypeError;

		// `RegExp.prototype.dotAll` getter
		// https://tc39.es/ecma262/#sec-get-regexp.prototype.dotall
		if (DESCRIPTORS && UNSUPPORTED_DOT_ALL) {
		  defineBuiltInAccessor(RegExpPrototype, 'dotAll', {
		    configurable: true,
		    get: function dotAll() {
		      if (this === RegExpPrototype) return;
		      // We can't use InternalStateModule.getterFor because
		      // we don't add metadata for regexps created by a literal.
		      if (classof(this) === 'RegExp') {
		        return !!getInternalState(this).dotAll;
		      }
		      throw new $TypeError('Incompatible receiver, RegExp required');
		    }
		  });
		}
		return es_regexp_dotAll;
	}

	requireEs_regexp_dotAll();

	var es_regexp_exec = {};

	var regexpExec;
	var hasRequiredRegexpExec;

	function requireRegexpExec () {
		if (hasRequiredRegexpExec) return regexpExec;
		hasRequiredRegexpExec = 1;
		/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
		/* eslint-disable regexp/no-useless-quantifier -- testing */
		var call = requireFunctionCall();
		var uncurryThis = requireFunctionUncurryThis();
		var toString = requireToString();
		var regexpFlags = requireRegexpFlags();
		var stickyHelpers = requireRegexpStickyHelpers();
		var shared = requireShared();
		var create = requireObjectCreate();
		var getInternalState = requireInternalState().get;
		var UNSUPPORTED_DOT_ALL = requireRegexpUnsupportedDotAll();
		var UNSUPPORTED_NCG = requireRegexpUnsupportedNcg();

		var nativeReplace = shared('native-string-replace', String.prototype.replace);
		var nativeExec = RegExp.prototype.exec;
		var patchedExec = nativeExec;
		var charAt = uncurryThis(''.charAt);
		var indexOf = uncurryThis(''.indexOf);
		var replace = uncurryThis(''.replace);
		var stringSlice = uncurryThis(''.slice);

		var UPDATES_LAST_INDEX_WRONG = (function () {
		  var re1 = /a/;
		  var re2 = /b*/g;
		  call(nativeExec, re1, 'a');
		  call(nativeExec, re2, 'a');
		  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
		})();

		var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;

		// nonparticipating capturing group, copied from es5-shim's String#split patch.
		var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

		var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

		if (PATCH) {
		  patchedExec = function exec(string) {
		    var re = this;
		    var state = getInternalState(re);
		    var str = toString(string);
		    var raw = state.raw;
		    var result, reCopy, lastIndex, match, i, object, group;

		    if (raw) {
		      raw.lastIndex = re.lastIndex;
		      result = call(patchedExec, raw, str);
		      re.lastIndex = raw.lastIndex;
		      return result;
		    }

		    var groups = state.groups;
		    var sticky = UNSUPPORTED_Y && re.sticky;
		    var flags = call(regexpFlags, re);
		    var source = re.source;
		    var charsAdded = 0;
		    var strCopy = str;

		    if (sticky) {
		      flags = replace(flags, 'y', '');
		      if (indexOf(flags, 'g') === -1) {
		        flags += 'g';
		      }

		      strCopy = stringSlice(str, re.lastIndex);
		      // Support anchored sticky behavior.
		      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
		        source = '(?: ' + source + ')';
		        strCopy = ' ' + strCopy;
		        charsAdded++;
		      }
		      // ^(? + rx + ) is needed, in combination with some str slicing, to
		      // simulate the 'y' flag.
		      reCopy = new RegExp('^(?:' + source + ')', flags);
		    }

		    if (NPCG_INCLUDED) {
		      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
		    }
		    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

		    match = call(nativeExec, sticky ? reCopy : re, strCopy);

		    if (sticky) {
		      if (match) {
		        match.input = stringSlice(match.input, charsAdded);
		        match[0] = stringSlice(match[0], charsAdded);
		        match.index = re.lastIndex;
		        re.lastIndex += match[0].length;
		      } else re.lastIndex = 0;
		    } else if (UPDATES_LAST_INDEX_WRONG && match) {
		      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
		    }
		    if (NPCG_INCLUDED && match && match.length > 1) {
		      // Fix browsers whose `exec` methods don't consistently return `undefined`
		      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
		      call(nativeReplace, match[0], reCopy, function () {
		        for (i = 1; i < arguments.length - 2; i++) {
		          if (arguments[i] === undefined) match[i] = undefined;
		        }
		      });
		    }

		    if (match && groups) {
		      match.groups = object = create(null);
		      for (i = 0; i < groups.length; i++) {
		        group = groups[i];
		        object[group[0]] = match[group[1]];
		      }
		    }

		    return match;
		  };
		}

		regexpExec = patchedExec;
		return regexpExec;
	}

	var hasRequiredEs_regexp_exec;

	function requireEs_regexp_exec () {
		if (hasRequiredEs_regexp_exec) return es_regexp_exec;
		hasRequiredEs_regexp_exec = 1;
		var $ = require_export();
		var exec = requireRegexpExec();

		// `RegExp.prototype.exec` method
		// https://tc39.es/ecma262/#sec-regexp.prototype.exec
		$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
		  exec: exec
		});
		return es_regexp_exec;
	}

	requireEs_regexp_exec();

	var es_regexp_flags = {};

	var hasRequiredEs_regexp_flags;

	function requireEs_regexp_flags () {
		if (hasRequiredEs_regexp_flags) return es_regexp_flags;
		hasRequiredEs_regexp_flags = 1;
		var globalThis = requireGlobalThis();
		var DESCRIPTORS = requireDescriptors();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var regExpFlags = requireRegexpFlags();
		var fails = requireFails();

		// babel-minify and Closure Compiler transpiles RegExp('.', 'd') -> /./d and it causes SyntaxError
		var RegExp = globalThis.RegExp;
		var RegExpPrototype = RegExp.prototype;

		var FORCED = DESCRIPTORS && fails(function () {
		  var INDICES_SUPPORT = true;
		  try {
		    RegExp('.', 'd');
		  } catch (error) {
		    INDICES_SUPPORT = false;
		  }

		  var O = {};
		  // modern V8 bug
		  var calls = '';
		  var expected = INDICES_SUPPORT ? 'dgimsy' : 'gimsy';

		  var addGetter = function (key, chr) {
		    // eslint-disable-next-line es/no-object-defineproperty -- safe
		    Object.defineProperty(O, key, { get: function () {
		      calls += chr;
		      return true;
		    } });
		  };

		  var pairs = {
		    dotAll: 's',
		    global: 'g',
		    ignoreCase: 'i',
		    multiline: 'm',
		    sticky: 'y'
		  };

		  if (INDICES_SUPPORT) pairs.hasIndices = 'd';

		  for (var key in pairs) addGetter(key, pairs[key]);

		  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		  var result = Object.getOwnPropertyDescriptor(RegExpPrototype, 'flags').get.call(O);

		  return result !== expected || calls !== expected;
		});

		// `RegExp.prototype.flags` getter
		// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
		if (FORCED) defineBuiltInAccessor(RegExpPrototype, 'flags', {
		  configurable: true,
		  get: regExpFlags
		});
		return es_regexp_flags;
	}

	requireEs_regexp_flags();

	var es_regexp_sticky = {};

	var hasRequiredEs_regexp_sticky;

	function requireEs_regexp_sticky () {
		if (hasRequiredEs_regexp_sticky) return es_regexp_sticky;
		hasRequiredEs_regexp_sticky = 1;
		var DESCRIPTORS = requireDescriptors();
		var MISSED_STICKY = requireRegexpStickyHelpers().MISSED_STICKY;
		var classof = requireClassofRaw();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var getInternalState = requireInternalState().get;

		var RegExpPrototype = RegExp.prototype;
		var $TypeError = TypeError;

		// `RegExp.prototype.sticky` getter
		// https://tc39.es/ecma262/#sec-get-regexp.prototype.sticky
		if (DESCRIPTORS && MISSED_STICKY) {
		  defineBuiltInAccessor(RegExpPrototype, 'sticky', {
		    configurable: true,
		    get: function sticky() {
		      if (this === RegExpPrototype) return;
		      // We can't use InternalStateModule.getterFor because
		      // we don't add metadata for regexps created by a literal.
		      if (classof(this) === 'RegExp') {
		        return !!getInternalState(this).sticky;
		      }
		      throw new $TypeError('Incompatible receiver, RegExp required');
		    }
		  });
		}
		return es_regexp_sticky;
	}

	requireEs_regexp_sticky();

	var es_regexp_test = {};

	var hasRequiredEs_regexp_test;

	function requireEs_regexp_test () {
		if (hasRequiredEs_regexp_test) return es_regexp_test;
		hasRequiredEs_regexp_test = 1;
		// TODO: Remove from `core-js@4` since it's moved to entry points
		requireEs_regexp_exec();
		var $ = require_export();
		var call = requireFunctionCall();
		var isCallable = requireIsCallable();
		var anObject = requireAnObject();
		var toString = requireToString();

		var DELEGATES_TO_EXEC = function () {
		  var execCalled = false;
		  var re = /[ac]/;
		  re.exec = function () {
		    execCalled = true;
		    return /./.exec.apply(this, arguments);
		  };
		  return re.test('abc') === true && execCalled;
		}();

		var nativeTest = /./.test;

		// `RegExp.prototype.test` method
		// https://tc39.es/ecma262/#sec-regexp.prototype.test
		$({ target: 'RegExp', proto: true, forced: !DELEGATES_TO_EXEC }, {
		  test: function (S) {
		    var R = anObject(this);
		    var string = toString(S);
		    var exec = R.exec;
		    if (!isCallable(exec)) return call(nativeTest, R, string);
		    var result = call(exec, R, string);
		    if (result === null) return false;
		    anObject(result);
		    return true;
		  }
		});
		return es_regexp_test;
	}

	requireEs_regexp_test();

	var es_regexp_toString = {};

	var hasRequiredEs_regexp_toString;

	function requireEs_regexp_toString () {
		if (hasRequiredEs_regexp_toString) return es_regexp_toString;
		hasRequiredEs_regexp_toString = 1;
		var PROPER_FUNCTION_NAME = requireFunctionName().PROPER;
		var defineBuiltIn = requireDefineBuiltIn();
		var anObject = requireAnObject();
		var $toString = requireToString();
		var fails = requireFails();
		var getRegExpFlags = requireRegexpGetFlags();

		var TO_STRING = 'toString';
		var RegExpPrototype = RegExp.prototype;
		var nativeToString = RegExpPrototype[TO_STRING];

		var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) !== '/a/b'; });
		// FF44- RegExp#toString has a wrong name
		var INCORRECT_NAME = PROPER_FUNCTION_NAME && nativeToString.name !== TO_STRING;

		// `RegExp.prototype.toString` method
		// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
		if (NOT_GENERIC || INCORRECT_NAME) {
		  defineBuiltIn(RegExpPrototype, TO_STRING, function toString() {
		    var R = anObject(this);
		    var pattern = $toString(R.source);
		    var flags = $toString(getRegExpFlags(R));
		    return '/' + pattern + '/' + flags;
		  }, { unsafe: true });
		}
		return es_regexp_toString;
	}

	requireEs_regexp_toString();

	var es_set = {};

	var es_set_constructor = {};

	var hasRequiredEs_set_constructor;

	function requireEs_set_constructor () {
		if (hasRequiredEs_set_constructor) return es_set_constructor;
		hasRequiredEs_set_constructor = 1;
		var collection = requireCollection();
		var collectionStrong = requireCollectionStrong();

		// `Set` constructor
		// https://tc39.es/ecma262/#sec-set-objects
		collection('Set', function (init) {
		  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
		}, collectionStrong);
		return es_set_constructor;
	}

	var hasRequiredEs_set;

	function requireEs_set () {
		if (hasRequiredEs_set) return es_set;
		hasRequiredEs_set = 1;
		// TODO: Remove this module from `core-js@4` since it's replaced to module below
		requireEs_set_constructor();
		return es_set;
	}

	requireEs_set();

	var es_set_difference_v2 = {};

	var setHelpers;
	var hasRequiredSetHelpers;

	function requireSetHelpers () {
		if (hasRequiredSetHelpers) return setHelpers;
		hasRequiredSetHelpers = 1;
		var uncurryThis = requireFunctionUncurryThis();

		// eslint-disable-next-line es/no-set -- safe
		var SetPrototype = Set.prototype;

		setHelpers = {
		  // eslint-disable-next-line es/no-set -- safe
		  Set: Set,
		  add: uncurryThis(SetPrototype.add),
		  has: uncurryThis(SetPrototype.has),
		  remove: uncurryThis(SetPrototype['delete']),
		  proto: SetPrototype
		};
		return setHelpers;
	}

	var aSet;
	var hasRequiredASet;

	function requireASet () {
		if (hasRequiredASet) return aSet;
		hasRequiredASet = 1;
		var has = requireSetHelpers().has;

		// Perform ? RequireInternalSlot(M, [[SetData]])
		aSet = function (it) {
		  has(it);
		  return it;
		};
		return aSet;
	}

	var iterateSimple;
	var hasRequiredIterateSimple;

	function requireIterateSimple () {
		if (hasRequiredIterateSimple) return iterateSimple;
		hasRequiredIterateSimple = 1;
		var call = requireFunctionCall();

		iterateSimple = function (record, fn, ITERATOR_INSTEAD_OF_RECORD) {
		  var iterator = ITERATOR_INSTEAD_OF_RECORD ? record : record.iterator;
		  var next = record.next;
		  var step, result;
		  while (!(step = call(next, iterator)).done) {
		    result = fn(step.value);
		    if (result !== undefined) return result;
		  }
		};
		return iterateSimple;
	}

	var setIterate;
	var hasRequiredSetIterate;

	function requireSetIterate () {
		if (hasRequiredSetIterate) return setIterate;
		hasRequiredSetIterate = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var iterateSimple = requireIterateSimple();
		var SetHelpers = requireSetHelpers();

		var Set = SetHelpers.Set;
		var SetPrototype = SetHelpers.proto;
		var forEach = uncurryThis(SetPrototype.forEach);
		var keys = uncurryThis(SetPrototype.keys);
		var next = keys(new Set()).next;

		setIterate = function (set, fn, interruptible) {
		  return interruptible ? iterateSimple({ iterator: keys(set), next: next }, fn) : forEach(set, fn);
		};
		return setIterate;
	}

	var setClone;
	var hasRequiredSetClone;

	function requireSetClone () {
		if (hasRequiredSetClone) return setClone;
		hasRequiredSetClone = 1;
		var SetHelpers = requireSetHelpers();
		var iterate = requireSetIterate();

		var Set = SetHelpers.Set;
		var add = SetHelpers.add;

		setClone = function (set) {
		  var result = new Set();
		  iterate(set, function (it) {
		    add(result, it);
		  });
		  return result;
		};
		return setClone;
	}

	var setSize;
	var hasRequiredSetSize;

	function requireSetSize () {
		if (hasRequiredSetSize) return setSize;
		hasRequiredSetSize = 1;
		var uncurryThisAccessor = requireFunctionUncurryThisAccessor();
		var SetHelpers = requireSetHelpers();

		setSize = uncurryThisAccessor(SetHelpers.proto, 'size', 'get') || function (set) {
		  return set.size;
		};
		return setSize;
	}

	var getIteratorDirect;
	var hasRequiredGetIteratorDirect;

	function requireGetIteratorDirect () {
		if (hasRequiredGetIteratorDirect) return getIteratorDirect;
		hasRequiredGetIteratorDirect = 1;
		// `GetIteratorDirect(obj)` abstract operation
		// https://tc39.es/proposal-iterator-helpers/#sec-getiteratordirect
		getIteratorDirect = function (obj) {
		  return {
		    iterator: obj,
		    next: obj.next,
		    done: false
		  };
		};
		return getIteratorDirect;
	}

	var getSetRecord;
	var hasRequiredGetSetRecord;

	function requireGetSetRecord () {
		if (hasRequiredGetSetRecord) return getSetRecord;
		hasRequiredGetSetRecord = 1;
		var aCallable = requireACallable();
		var anObject = requireAnObject();
		var call = requireFunctionCall();
		var toIntegerOrInfinity = requireToIntegerOrInfinity();
		var getIteratorDirect = requireGetIteratorDirect();

		var INVALID_SIZE = 'Invalid size';
		var $RangeError = RangeError;
		var $TypeError = TypeError;
		var max = Math.max;

		var SetRecord = function (set, intSize) {
		  this.set = set;
		  this.size = max(intSize, 0);
		  this.has = aCallable(set.has);
		  this.keys = aCallable(set.keys);
		};

		SetRecord.prototype = {
		  getIterator: function () {
		    return getIteratorDirect(anObject(call(this.keys, this.set)));
		  },
		  includes: function (it) {
		    return call(this.has, this.set, it);
		  }
		};

		// `GetSetRecord` abstract operation
		// https://tc39.es/proposal-set-methods/#sec-getsetrecord
		getSetRecord = function (obj) {
		  anObject(obj);
		  var numSize = +obj.size;
		  // NOTE: If size is undefined, then numSize will be NaN
		  // eslint-disable-next-line no-self-compare -- NaN check
		  if (numSize !== numSize) throw new $TypeError(INVALID_SIZE);
		  var intSize = toIntegerOrInfinity(numSize);
		  if (intSize < 0) throw new $RangeError(INVALID_SIZE);
		  return new SetRecord(obj, intSize);
		};
		return getSetRecord;
	}

	var setDifference;
	var hasRequiredSetDifference;

	function requireSetDifference () {
		if (hasRequiredSetDifference) return setDifference;
		hasRequiredSetDifference = 1;
		var aSet = requireASet();
		var SetHelpers = requireSetHelpers();
		var clone = requireSetClone();
		var size = requireSetSize();
		var getSetRecord = requireGetSetRecord();
		var iterateSet = requireSetIterate();
		var iterateSimple = requireIterateSimple();

		var has = SetHelpers.has;
		var remove = SetHelpers.remove;

		// `Set.prototype.difference` method
		// https://github.com/tc39/proposal-set-methods
		setDifference = function difference(other) {
		  var O = aSet(this);
		  var otherRec = getSetRecord(other);
		  var result = clone(O);
		  if (size(O) <= otherRec.size) iterateSet(O, function (e) {
		    if (otherRec.includes(e)) remove(result, e);
		  });
		  else iterateSimple(otherRec.getIterator(), function (e) {
		    if (has(O, e)) remove(result, e);
		  });
		  return result;
		};
		return setDifference;
	}

	var setMethodAcceptSetLike;
	var hasRequiredSetMethodAcceptSetLike;

	function requireSetMethodAcceptSetLike () {
		if (hasRequiredSetMethodAcceptSetLike) return setMethodAcceptSetLike;
		hasRequiredSetMethodAcceptSetLike = 1;
		var getBuiltIn = requireGetBuiltIn();

		var createSetLike = function (size) {
		  return {
		    size: size,
		    has: function () {
		      return false;
		    },
		    keys: function () {
		      return {
		        next: function () {
		          return { done: true };
		        }
		      };
		    }
		  };
		};

		setMethodAcceptSetLike = function (name) {
		  var Set = getBuiltIn('Set');
		  try {
		    new Set()[name](createSetLike(0));
		    try {
		      // late spec change, early WebKit ~ Safari 17.0 beta implementation does not pass it
		      // https://github.com/tc39/proposal-set-methods/pull/88
		      new Set()[name](createSetLike(-1));
		      return false;
		    } catch (error2) {
		      return true;
		    }
		  } catch (error) {
		    return false;
		  }
		};
		return setMethodAcceptSetLike;
	}

	var hasRequiredEs_set_difference_v2;

	function requireEs_set_difference_v2 () {
		if (hasRequiredEs_set_difference_v2) return es_set_difference_v2;
		hasRequiredEs_set_difference_v2 = 1;
		var $ = require_export();
		var difference = requireSetDifference();
		var setMethodAcceptSetLike = requireSetMethodAcceptSetLike();

		// `Set.prototype.difference` method
		// https://tc39.es/ecma262/#sec-set.prototype.difference
		$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('difference') }, {
		  difference: difference
		});
		return es_set_difference_v2;
	}

	requireEs_set_difference_v2();

	var es_set_intersection_v2 = {};

	var setIntersection;
	var hasRequiredSetIntersection;

	function requireSetIntersection () {
		if (hasRequiredSetIntersection) return setIntersection;
		hasRequiredSetIntersection = 1;
		var aSet = requireASet();
		var SetHelpers = requireSetHelpers();
		var size = requireSetSize();
		var getSetRecord = requireGetSetRecord();
		var iterateSet = requireSetIterate();
		var iterateSimple = requireIterateSimple();

		var Set = SetHelpers.Set;
		var add = SetHelpers.add;
		var has = SetHelpers.has;

		// `Set.prototype.intersection` method
		// https://github.com/tc39/proposal-set-methods
		setIntersection = function intersection(other) {
		  var O = aSet(this);
		  var otherRec = getSetRecord(other);
		  var result = new Set();

		  if (size(O) > otherRec.size) {
		    iterateSimple(otherRec.getIterator(), function (e) {
		      if (has(O, e)) add(result, e);
		    });
		  } else {
		    iterateSet(O, function (e) {
		      if (otherRec.includes(e)) add(result, e);
		    });
		  }

		  return result;
		};
		return setIntersection;
	}

	var hasRequiredEs_set_intersection_v2;

	function requireEs_set_intersection_v2 () {
		if (hasRequiredEs_set_intersection_v2) return es_set_intersection_v2;
		hasRequiredEs_set_intersection_v2 = 1;
		var $ = require_export();
		var fails = requireFails();
		var intersection = requireSetIntersection();
		var setMethodAcceptSetLike = requireSetMethodAcceptSetLike();

		var INCORRECT = !setMethodAcceptSetLike('intersection') || fails(function () {
		  // eslint-disable-next-line es/no-array-from, es/no-set -- testing
		  return String(Array.from(new Set([1, 2, 3]).intersection(new Set([3, 2])))) !== '3,2';
		});

		// `Set.prototype.intersection` method
		// https://tc39.es/ecma262/#sec-set.prototype.intersection
		$({ target: 'Set', proto: true, real: true, forced: INCORRECT }, {
		  intersection: intersection
		});
		return es_set_intersection_v2;
	}

	requireEs_set_intersection_v2();

	var es_set_isDisjointFrom_v2 = {};

	var setIsDisjointFrom;
	var hasRequiredSetIsDisjointFrom;

	function requireSetIsDisjointFrom () {
		if (hasRequiredSetIsDisjointFrom) return setIsDisjointFrom;
		hasRequiredSetIsDisjointFrom = 1;
		var aSet = requireASet();
		var has = requireSetHelpers().has;
		var size = requireSetSize();
		var getSetRecord = requireGetSetRecord();
		var iterateSet = requireSetIterate();
		var iterateSimple = requireIterateSimple();
		var iteratorClose = requireIteratorClose();

		// `Set.prototype.isDisjointFrom` method
		// https://tc39.github.io/proposal-set-methods/#Set.prototype.isDisjointFrom
		setIsDisjointFrom = function isDisjointFrom(other) {
		  var O = aSet(this);
		  var otherRec = getSetRecord(other);
		  if (size(O) <= otherRec.size) return iterateSet(O, function (e) {
		    if (otherRec.includes(e)) return false;
		  }, true) !== false;
		  var iterator = otherRec.getIterator();
		  return iterateSimple(iterator, function (e) {
		    if (has(O, e)) return iteratorClose(iterator, 'normal', false);
		  }) !== false;
		};
		return setIsDisjointFrom;
	}

	var hasRequiredEs_set_isDisjointFrom_v2;

	function requireEs_set_isDisjointFrom_v2 () {
		if (hasRequiredEs_set_isDisjointFrom_v2) return es_set_isDisjointFrom_v2;
		hasRequiredEs_set_isDisjointFrom_v2 = 1;
		var $ = require_export();
		var isDisjointFrom = requireSetIsDisjointFrom();
		var setMethodAcceptSetLike = requireSetMethodAcceptSetLike();

		// `Set.prototype.isDisjointFrom` method
		// https://tc39.es/ecma262/#sec-set.prototype.isdisjointfrom
		$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('isDisjointFrom') }, {
		  isDisjointFrom: isDisjointFrom
		});
		return es_set_isDisjointFrom_v2;
	}

	requireEs_set_isDisjointFrom_v2();

	var es_set_isSubsetOf_v2 = {};

	var setIsSubsetOf;
	var hasRequiredSetIsSubsetOf;

	function requireSetIsSubsetOf () {
		if (hasRequiredSetIsSubsetOf) return setIsSubsetOf;
		hasRequiredSetIsSubsetOf = 1;
		var aSet = requireASet();
		var size = requireSetSize();
		var iterate = requireSetIterate();
		var getSetRecord = requireGetSetRecord();

		// `Set.prototype.isSubsetOf` method
		// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSubsetOf
		setIsSubsetOf = function isSubsetOf(other) {
		  var O = aSet(this);
		  var otherRec = getSetRecord(other);
		  if (size(O) > otherRec.size) return false;
		  return iterate(O, function (e) {
		    if (!otherRec.includes(e)) return false;
		  }, true) !== false;
		};
		return setIsSubsetOf;
	}

	var hasRequiredEs_set_isSubsetOf_v2;

	function requireEs_set_isSubsetOf_v2 () {
		if (hasRequiredEs_set_isSubsetOf_v2) return es_set_isSubsetOf_v2;
		hasRequiredEs_set_isSubsetOf_v2 = 1;
		var $ = require_export();
		var isSubsetOf = requireSetIsSubsetOf();
		var setMethodAcceptSetLike = requireSetMethodAcceptSetLike();

		// `Set.prototype.isSubsetOf` method
		// https://tc39.es/ecma262/#sec-set.prototype.issubsetof
		$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('isSubsetOf') }, {
		  isSubsetOf: isSubsetOf
		});
		return es_set_isSubsetOf_v2;
	}

	requireEs_set_isSubsetOf_v2();

	var es_set_isSupersetOf_v2 = {};

	var setIsSupersetOf;
	var hasRequiredSetIsSupersetOf;

	function requireSetIsSupersetOf () {
		if (hasRequiredSetIsSupersetOf) return setIsSupersetOf;
		hasRequiredSetIsSupersetOf = 1;
		var aSet = requireASet();
		var has = requireSetHelpers().has;
		var size = requireSetSize();
		var getSetRecord = requireGetSetRecord();
		var iterateSimple = requireIterateSimple();
		var iteratorClose = requireIteratorClose();

		// `Set.prototype.isSupersetOf` method
		// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSupersetOf
		setIsSupersetOf = function isSupersetOf(other) {
		  var O = aSet(this);
		  var otherRec = getSetRecord(other);
		  if (size(O) < otherRec.size) return false;
		  var iterator = otherRec.getIterator();
		  return iterateSimple(iterator, function (e) {
		    if (!has(O, e)) return iteratorClose(iterator, 'normal', false);
		  }) !== false;
		};
		return setIsSupersetOf;
	}

	var hasRequiredEs_set_isSupersetOf_v2;

	function requireEs_set_isSupersetOf_v2 () {
		if (hasRequiredEs_set_isSupersetOf_v2) return es_set_isSupersetOf_v2;
		hasRequiredEs_set_isSupersetOf_v2 = 1;
		var $ = require_export();
		var isSupersetOf = requireSetIsSupersetOf();
		var setMethodAcceptSetLike = requireSetMethodAcceptSetLike();

		// `Set.prototype.isSupersetOf` method
		// https://tc39.es/ecma262/#sec-set.prototype.issupersetof
		$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('isSupersetOf') }, {
		  isSupersetOf: isSupersetOf
		});
		return es_set_isSupersetOf_v2;
	}

	requireEs_set_isSupersetOf_v2();

	var es_set_symmetricDifference_v2 = {};

	var setSymmetricDifference;
	var hasRequiredSetSymmetricDifference;

	function requireSetSymmetricDifference () {
		if (hasRequiredSetSymmetricDifference) return setSymmetricDifference;
		hasRequiredSetSymmetricDifference = 1;
		var aSet = requireASet();
		var SetHelpers = requireSetHelpers();
		var clone = requireSetClone();
		var getSetRecord = requireGetSetRecord();
		var iterateSimple = requireIterateSimple();

		var add = SetHelpers.add;
		var has = SetHelpers.has;
		var remove = SetHelpers.remove;

		// `Set.prototype.symmetricDifference` method
		// https://github.com/tc39/proposal-set-methods
		setSymmetricDifference = function symmetricDifference(other) {
		  var O = aSet(this);
		  var keysIter = getSetRecord(other).getIterator();
		  var result = clone(O);
		  iterateSimple(keysIter, function (e) {
		    if (has(O, e)) remove(result, e);
		    else add(result, e);
		  });
		  return result;
		};
		return setSymmetricDifference;
	}

	var hasRequiredEs_set_symmetricDifference_v2;

	function requireEs_set_symmetricDifference_v2 () {
		if (hasRequiredEs_set_symmetricDifference_v2) return es_set_symmetricDifference_v2;
		hasRequiredEs_set_symmetricDifference_v2 = 1;
		var $ = require_export();
		var symmetricDifference = requireSetSymmetricDifference();
		var setMethodAcceptSetLike = requireSetMethodAcceptSetLike();

		// `Set.prototype.symmetricDifference` method
		// https://tc39.es/ecma262/#sec-set.prototype.symmetricdifference
		$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('symmetricDifference') }, {
		  symmetricDifference: symmetricDifference
		});
		return es_set_symmetricDifference_v2;
	}

	requireEs_set_symmetricDifference_v2();

	var es_set_union_v2 = {};

	var setUnion;
	var hasRequiredSetUnion;

	function requireSetUnion () {
		if (hasRequiredSetUnion) return setUnion;
		hasRequiredSetUnion = 1;
		var aSet = requireASet();
		var add = requireSetHelpers().add;
		var clone = requireSetClone();
		var getSetRecord = requireGetSetRecord();
		var iterateSimple = requireIterateSimple();

		// `Set.prototype.union` method
		// https://github.com/tc39/proposal-set-methods
		setUnion = function union(other) {
		  var O = aSet(this);
		  var keysIter = getSetRecord(other).getIterator();
		  var result = clone(O);
		  iterateSimple(keysIter, function (it) {
		    add(result, it);
		  });
		  return result;
		};
		return setUnion;
	}

	var hasRequiredEs_set_union_v2;

	function requireEs_set_union_v2 () {
		if (hasRequiredEs_set_union_v2) return es_set_union_v2;
		hasRequiredEs_set_union_v2 = 1;
		var $ = require_export();
		var union = requireSetUnion();
		var setMethodAcceptSetLike = requireSetMethodAcceptSetLike();

		// `Set.prototype.union` method
		// https://tc39.es/ecma262/#sec-set.prototype.union
		$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('union') }, {
		  union: union
		});
		return es_set_union_v2;
	}

	requireEs_set_union_v2();

	var es_string_endsWith = {};

	var notARegexp;
	var hasRequiredNotARegexp;

	function requireNotARegexp () {
		if (hasRequiredNotARegexp) return notARegexp;
		hasRequiredNotARegexp = 1;
		var isRegExp = requireIsRegexp();

		var $TypeError = TypeError;

		notARegexp = function (it) {
		  if (isRegExp(it)) {
		    throw new $TypeError("The method doesn't accept regular expressions");
		  } return it;
		};
		return notARegexp;
	}

	var correctIsRegexpLogic;
	var hasRequiredCorrectIsRegexpLogic;

	function requireCorrectIsRegexpLogic () {
		if (hasRequiredCorrectIsRegexpLogic) return correctIsRegexpLogic;
		hasRequiredCorrectIsRegexpLogic = 1;
		var wellKnownSymbol = requireWellKnownSymbol();

		var MATCH = wellKnownSymbol('match');

		correctIsRegexpLogic = function (METHOD_NAME) {
		  var regexp = /./;
		  try {
		    '/./'[METHOD_NAME](regexp);
		  } catch (error1) {
		    try {
		      regexp[MATCH] = false;
		      return '/./'[METHOD_NAME](regexp);
		    } catch (error2) { /* empty */ }
		  } return false;
		};
		return correctIsRegexpLogic;
	}

	var hasRequiredEs_string_endsWith;

	function requireEs_string_endsWith () {
		if (hasRequiredEs_string_endsWith) return es_string_endsWith;
		hasRequiredEs_string_endsWith = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThisClause();
		var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
		var toLength = requireToLength();
		var toString = requireToString();
		var notARegExp = requireNotARegexp();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var correctIsRegExpLogic = requireCorrectIsRegexpLogic();
		var IS_PURE = requireIsPure();

		var slice = uncurryThis(''.slice);
		var min = Math.min;

		var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('endsWith');
		// https://github.com/zloirock/core-js/pull/702
		var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
		  var descriptor = getOwnPropertyDescriptor(String.prototype, 'endsWith');
		  return descriptor && !descriptor.writable;
		}();

		// `String.prototype.endsWith` method
		// https://tc39.es/ecma262/#sec-string.prototype.endswith
		$({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
		  endsWith: function endsWith(searchString /* , endPosition = @length */) {
		    var that = toString(requireObjectCoercible(this));
		    notARegExp(searchString);
		    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
		    var len = that.length;
		    var end = endPosition === undefined ? len : min(toLength(endPosition), len);
		    var search = toString(searchString);
		    return slice(that, end - search.length, end) === search;
		  }
		});
		return es_string_endsWith;
	}

	requireEs_string_endsWith();

	var es_string_includes = {};

	var hasRequiredEs_string_includes;

	function requireEs_string_includes () {
		if (hasRequiredEs_string_includes) return es_string_includes;
		hasRequiredEs_string_includes = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThis();
		var notARegExp = requireNotARegexp();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var toString = requireToString();
		var correctIsRegExpLogic = requireCorrectIsRegexpLogic();

		var stringIndexOf = uncurryThis(''.indexOf);

		// `String.prototype.includes` method
		// https://tc39.es/ecma262/#sec-string.prototype.includes
		$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
		  includes: function includes(searchString /* , position = 0 */) {
		    return !!~stringIndexOf(
		      toString(requireObjectCoercible(this)),
		      toString(notARegExp(searchString)),
		      arguments.length > 1 ? arguments[1] : undefined
		    );
		  }
		});
		return es_string_includes;
	}

	requireEs_string_includes();

	var es_string_iterator = {};

	var stringMultibyte;
	var hasRequiredStringMultibyte;

	function requireStringMultibyte () {
		if (hasRequiredStringMultibyte) return stringMultibyte;
		hasRequiredStringMultibyte = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var toIntegerOrInfinity = requireToIntegerOrInfinity();
		var toString = requireToString();
		var requireObjectCoercible = requireRequireObjectCoercible();

		var charAt = uncurryThis(''.charAt);
		var charCodeAt = uncurryThis(''.charCodeAt);
		var stringSlice = uncurryThis(''.slice);

		var createMethod = function (CONVERT_TO_STRING) {
		  return function ($this, pos) {
		    var S = toString(requireObjectCoercible($this));
		    var position = toIntegerOrInfinity(pos);
		    var size = S.length;
		    var first, second;
		    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
		    first = charCodeAt(S, position);
		    return first < 0xD800 || first > 0xDBFF || position + 1 === size
		      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
		        ? CONVERT_TO_STRING
		          ? charAt(S, position)
		          : first
		        : CONVERT_TO_STRING
		          ? stringSlice(S, position, position + 2)
		          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
		  };
		};

		stringMultibyte = {
		  // `String.prototype.codePointAt` method
		  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
		  codeAt: createMethod(false),
		  // `String.prototype.at` method
		  // https://github.com/mathiasbynens/String.prototype.at
		  charAt: createMethod(true)
		};
		return stringMultibyte;
	}

	var hasRequiredEs_string_iterator;

	function requireEs_string_iterator () {
		if (hasRequiredEs_string_iterator) return es_string_iterator;
		hasRequiredEs_string_iterator = 1;
		var charAt = requireStringMultibyte().charAt;
		var toString = requireToString();
		var InternalStateModule = requireInternalState();
		var defineIterator = requireIteratorDefine();
		var createIterResultObject = requireCreateIterResultObject();

		var STRING_ITERATOR = 'String Iterator';
		var setInternalState = InternalStateModule.set;
		var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

		// `String.prototype[@@iterator]` method
		// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
		defineIterator(String, 'String', function (iterated) {
		  setInternalState(this, {
		    type: STRING_ITERATOR,
		    string: toString(iterated),
		    index: 0
		  });
		// `%StringIteratorPrototype%.next` method
		// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
		}, function next() {
		  var state = getInternalState(this);
		  var string = state.string;
		  var index = state.index;
		  var point;
		  if (index >= string.length) return createIterResultObject(undefined, true);
		  point = charAt(string, index);
		  state.index += point.length;
		  return createIterResultObject(point, false);
		});
		return es_string_iterator;
	}

	requireEs_string_iterator();

	var es_string_match = {};

	var fixRegexpWellKnownSymbolLogic;
	var hasRequiredFixRegexpWellKnownSymbolLogic;

	function requireFixRegexpWellKnownSymbolLogic () {
		if (hasRequiredFixRegexpWellKnownSymbolLogic) return fixRegexpWellKnownSymbolLogic;
		hasRequiredFixRegexpWellKnownSymbolLogic = 1;
		// TODO: Remove from `core-js@4` since it's moved to entry points
		requireEs_regexp_exec();
		var call = requireFunctionCall();
		var defineBuiltIn = requireDefineBuiltIn();
		var regexpExec = requireRegexpExec();
		var fails = requireFails();
		var wellKnownSymbol = requireWellKnownSymbol();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();

		var SPECIES = wellKnownSymbol('species');
		var RegExpPrototype = RegExp.prototype;

		fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
		  var SYMBOL = wellKnownSymbol(KEY);

		  var DELEGATES_TO_SYMBOL = !fails(function () {
		    // String methods call symbol-named RegExp methods
		    var O = {};
		    O[SYMBOL] = function () { return 7; };
		    return ''[KEY](O) !== 7;
		  });

		  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
		    // Symbol-named RegExp methods call .exec
		    var execCalled = false;
		    var re = /a/;

		    if (KEY === 'split') {
		      // We can't use real regex here since it causes deoptimization
		      // and serious performance degradation in V8
		      // https://github.com/zloirock/core-js/issues/306
		      re = {};
		      // RegExp[@@split] doesn't call the regex's exec method, but first creates
		      // a new one. We need to return the patched regex when creating the new one.
		      re.constructor = {};
		      re.constructor[SPECIES] = function () { return re; };
		      re.flags = '';
		      re[SYMBOL] = /./[SYMBOL];
		    }

		    re.exec = function () {
		      execCalled = true;
		      return null;
		    };

		    re[SYMBOL]('');
		    return !execCalled;
		  });

		  if (
		    !DELEGATES_TO_SYMBOL ||
		    !DELEGATES_TO_EXEC ||
		    FORCED
		  ) {
		    var nativeRegExpMethod = /./[SYMBOL];
		    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
		      var $exec = regexp.exec;
		      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
		        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
		          // The native String method already delegates to @@method (this
		          // polyfilled function), leasing to infinite recursion.
		          // We avoid it by directly calling the native @@method method.
		          return { done: true, value: call(nativeRegExpMethod, regexp, str, arg2) };
		        }
		        return { done: true, value: call(nativeMethod, str, regexp, arg2) };
		      }
		      return { done: false };
		    });

		    defineBuiltIn(String.prototype, KEY, methods[0]);
		    defineBuiltIn(RegExpPrototype, SYMBOL, methods[1]);
		  }

		  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
		};
		return fixRegexpWellKnownSymbolLogic;
	}

	var advanceStringIndex;
	var hasRequiredAdvanceStringIndex;

	function requireAdvanceStringIndex () {
		if (hasRequiredAdvanceStringIndex) return advanceStringIndex;
		hasRequiredAdvanceStringIndex = 1;
		var charAt = requireStringMultibyte().charAt;

		// `AdvanceStringIndex` abstract operation
		// https://tc39.es/ecma262/#sec-advancestringindex
		advanceStringIndex = function (S, index, unicode) {
		  return index + (unicode ? charAt(S, index).length : 1);
		};
		return advanceStringIndex;
	}

	var regexpExecAbstract;
	var hasRequiredRegexpExecAbstract;

	function requireRegexpExecAbstract () {
		if (hasRequiredRegexpExecAbstract) return regexpExecAbstract;
		hasRequiredRegexpExecAbstract = 1;
		var call = requireFunctionCall();
		var anObject = requireAnObject();
		var isCallable = requireIsCallable();
		var classof = requireClassofRaw();
		var regexpExec = requireRegexpExec();

		var $TypeError = TypeError;

		// `RegExpExec` abstract operation
		// https://tc39.es/ecma262/#sec-regexpexec
		regexpExecAbstract = function (R, S) {
		  var exec = R.exec;
		  if (isCallable(exec)) {
		    var result = call(exec, R, S);
		    if (result !== null) anObject(result);
		    return result;
		  }
		  if (classof(R) === 'RegExp') return call(regexpExec, R, S);
		  throw new $TypeError('RegExp#exec called on incompatible receiver');
		};
		return regexpExecAbstract;
	}

	var hasRequiredEs_string_match;

	function requireEs_string_match () {
		if (hasRequiredEs_string_match) return es_string_match;
		hasRequiredEs_string_match = 1;
		var call = requireFunctionCall();
		var fixRegExpWellKnownSymbolLogic = requireFixRegexpWellKnownSymbolLogic();
		var anObject = requireAnObject();
		var isNullOrUndefined = requireIsNullOrUndefined();
		var toLength = requireToLength();
		var toString = requireToString();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var getMethod = requireGetMethod();
		var advanceStringIndex = requireAdvanceStringIndex();
		var regExpExec = requireRegexpExecAbstract();

		// @@match logic
		fixRegExpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
		  return [
		    // `String.prototype.match` method
		    // https://tc39.es/ecma262/#sec-string.prototype.match
		    function match(regexp) {
		      var O = requireObjectCoercible(this);
		      var matcher = isNullOrUndefined(regexp) ? undefined : getMethod(regexp, MATCH);
		      return matcher ? call(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString(O));
		    },
		    // `RegExp.prototype[@@match]` method
		    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
		    function (string) {
		      var rx = anObject(this);
		      var S = toString(string);
		      var res = maybeCallNative(nativeMatch, rx, S);

		      if (res.done) return res.value;

		      if (!rx.global) return regExpExec(rx, S);

		      var fullUnicode = rx.unicode;
		      rx.lastIndex = 0;
		      var A = [];
		      var n = 0;
		      var result;
		      while ((result = regExpExec(rx, S)) !== null) {
		        var matchStr = toString(result[0]);
		        A[n] = matchStr;
		        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
		        n++;
		      }
		      return n === 0 ? null : A;
		    }
		  ];
		});
		return es_string_match;
	}

	requireEs_string_match();

	var es_string_replace = {};

	var getSubstitution;
	var hasRequiredGetSubstitution;

	function requireGetSubstitution () {
		if (hasRequiredGetSubstitution) return getSubstitution;
		hasRequiredGetSubstitution = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var toObject = requireToObject();

		var floor = Math.floor;
		var charAt = uncurryThis(''.charAt);
		var replace = uncurryThis(''.replace);
		var stringSlice = uncurryThis(''.slice);
		// eslint-disable-next-line redos/no-vulnerable -- safe
		var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
		var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

		// `GetSubstitution` abstract operation
		// https://tc39.es/ecma262/#sec-getsubstitution
		getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
		  var tailPos = position + matched.length;
		  var m = captures.length;
		  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
		  if (namedCaptures !== undefined) {
		    namedCaptures = toObject(namedCaptures);
		    symbols = SUBSTITUTION_SYMBOLS;
		  }
		  return replace(replacement, symbols, function (match, ch) {
		    var capture;
		    switch (charAt(ch, 0)) {
		      case '$': return '$';
		      case '&': return matched;
		      case '`': return stringSlice(str, 0, position);
		      case "'": return stringSlice(str, tailPos);
		      case '<':
		        capture = namedCaptures[stringSlice(ch, 1, -1)];
		        break;
		      default: // \d\d?
		        var n = +ch;
		        if (n === 0) return match;
		        if (n > m) {
		          var f = floor(n / 10);
		          if (f === 0) return match;
		          if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
		          return match;
		        }
		        capture = captures[n - 1];
		    }
		    return capture === undefined ? '' : capture;
		  });
		};
		return getSubstitution;
	}

	var hasRequiredEs_string_replace;

	function requireEs_string_replace () {
		if (hasRequiredEs_string_replace) return es_string_replace;
		hasRequiredEs_string_replace = 1;
		var apply = requireFunctionApply();
		var call = requireFunctionCall();
		var uncurryThis = requireFunctionUncurryThis();
		var fixRegExpWellKnownSymbolLogic = requireFixRegexpWellKnownSymbolLogic();
		var fails = requireFails();
		var anObject = requireAnObject();
		var isCallable = requireIsCallable();
		var isNullOrUndefined = requireIsNullOrUndefined();
		var toIntegerOrInfinity = requireToIntegerOrInfinity();
		var toLength = requireToLength();
		var toString = requireToString();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var advanceStringIndex = requireAdvanceStringIndex();
		var getMethod = requireGetMethod();
		var getSubstitution = requireGetSubstitution();
		var regExpExec = requireRegexpExecAbstract();
		var wellKnownSymbol = requireWellKnownSymbol();

		var REPLACE = wellKnownSymbol('replace');
		var max = Math.max;
		var min = Math.min;
		var concat = uncurryThis([].concat);
		var push = uncurryThis([].push);
		var stringIndexOf = uncurryThis(''.indexOf);
		var stringSlice = uncurryThis(''.slice);

		var maybeToString = function (it) {
		  return it === undefined ? it : String(it);
		};

		// IE <= 11 replaces $0 with the whole match, as if it was $&
		// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
		var REPLACE_KEEPS_$0 = (function () {
		  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
		  return 'a'.replace(/./, '$0') === '$0';
		})();

		// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
		var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
		  if (/./[REPLACE]) {
		    return /./[REPLACE]('a', '$0') === '';
		  }
		  return false;
		})();

		var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
		  var re = /./;
		  re.exec = function () {
		    var result = [];
		    result.groups = { a: '7' };
		    return result;
		  };
		  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
		  return ''.replace(re, '$<a>') !== '7';
		});

		// @@replace logic
		fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
		  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

		  return [
		    // `String.prototype.replace` method
		    // https://tc39.es/ecma262/#sec-string.prototype.replace
		    function replace(searchValue, replaceValue) {
		      var O = requireObjectCoercible(this);
		      var replacer = isNullOrUndefined(searchValue) ? undefined : getMethod(searchValue, REPLACE);
		      return replacer
		        ? call(replacer, searchValue, O, replaceValue)
		        : call(nativeReplace, toString(O), searchValue, replaceValue);
		    },
		    // `RegExp.prototype[@@replace]` method
		    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
		    function (string, replaceValue) {
		      var rx = anObject(this);
		      var S = toString(string);

		      if (
		        typeof replaceValue == 'string' &&
		        stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
		        stringIndexOf(replaceValue, '$<') === -1
		      ) {
		        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
		        if (res.done) return res.value;
		      }

		      var functionalReplace = isCallable(replaceValue);
		      if (!functionalReplace) replaceValue = toString(replaceValue);

		      var global = rx.global;
		      var fullUnicode;
		      if (global) {
		        fullUnicode = rx.unicode;
		        rx.lastIndex = 0;
		      }

		      var results = [];
		      var result;
		      while (true) {
		        result = regExpExec(rx, S);
		        if (result === null) break;

		        push(results, result);
		        if (!global) break;

		        var matchStr = toString(result[0]);
		        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
		      }

		      var accumulatedResult = '';
		      var nextSourcePosition = 0;
		      for (var i = 0; i < results.length; i++) {
		        result = results[i];

		        var matched = toString(result[0]);
		        var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
		        var captures = [];
		        var replacement;
		        // NOTE: This is equivalent to
		        //   captures = result.slice(1).map(maybeToString)
		        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
		        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
		        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
		        for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
		        var namedCaptures = result.groups;
		        if (functionalReplace) {
		          var replacerArgs = concat([matched], captures, position, S);
		          if (namedCaptures !== undefined) push(replacerArgs, namedCaptures);
		          replacement = toString(apply(replaceValue, undefined, replacerArgs));
		        } else {
		          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
		        }
		        if (position >= nextSourcePosition) {
		          accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
		          nextSourcePosition = position + matched.length;
		        }
		      }

		      return accumulatedResult + stringSlice(S, nextSourcePosition);
		    }
		  ];
		}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);
		return es_string_replace;
	}

	requireEs_string_replace();

	var es_string_search = {};

	var hasRequiredEs_string_search;

	function requireEs_string_search () {
		if (hasRequiredEs_string_search) return es_string_search;
		hasRequiredEs_string_search = 1;
		var call = requireFunctionCall();
		var fixRegExpWellKnownSymbolLogic = requireFixRegexpWellKnownSymbolLogic();
		var anObject = requireAnObject();
		var isNullOrUndefined = requireIsNullOrUndefined();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var sameValue = requireSameValue();
		var toString = requireToString();
		var getMethod = requireGetMethod();
		var regExpExec = requireRegexpExecAbstract();

		// @@search logic
		fixRegExpWellKnownSymbolLogic('search', function (SEARCH, nativeSearch, maybeCallNative) {
		  return [
		    // `String.prototype.search` method
		    // https://tc39.es/ecma262/#sec-string.prototype.search
		    function search(regexp) {
		      var O = requireObjectCoercible(this);
		      var searcher = isNullOrUndefined(regexp) ? undefined : getMethod(regexp, SEARCH);
		      return searcher ? call(searcher, regexp, O) : new RegExp(regexp)[SEARCH](toString(O));
		    },
		    // `RegExp.prototype[@@search]` method
		    // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
		    function (string) {
		      var rx = anObject(this);
		      var S = toString(string);
		      var res = maybeCallNative(nativeSearch, rx, S);

		      if (res.done) return res.value;

		      var previousLastIndex = rx.lastIndex;
		      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
		      var result = regExpExec(rx, S);
		      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
		      return result === null ? -1 : result.index;
		    }
		  ];
		});
		return es_string_search;
	}

	requireEs_string_search();

	var es_string_split = {};

	var hasRequiredEs_string_split;

	function requireEs_string_split () {
		if (hasRequiredEs_string_split) return es_string_split;
		hasRequiredEs_string_split = 1;
		var call = requireFunctionCall();
		var uncurryThis = requireFunctionUncurryThis();
		var fixRegExpWellKnownSymbolLogic = requireFixRegexpWellKnownSymbolLogic();
		var anObject = requireAnObject();
		var isNullOrUndefined = requireIsNullOrUndefined();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var speciesConstructor = requireSpeciesConstructor();
		var advanceStringIndex = requireAdvanceStringIndex();
		var toLength = requireToLength();
		var toString = requireToString();
		var getMethod = requireGetMethod();
		var regExpExec = requireRegexpExecAbstract();
		var stickyHelpers = requireRegexpStickyHelpers();
		var fails = requireFails();

		var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
		var MAX_UINT32 = 0xFFFFFFFF;
		var min = Math.min;
		var push = uncurryThis([].push);
		var stringSlice = uncurryThis(''.slice);

		// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
		// Weex JS has frozen built-in prototypes, so use try / catch wrapper
		var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
		  // eslint-disable-next-line regexp/no-empty-group -- required for testing
		  var re = /(?:)/;
		  var originalExec = re.exec;
		  re.exec = function () { return originalExec.apply(this, arguments); };
		  var result = 'ab'.split(re);
		  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
		});

		var BUGGY = 'abbc'.split(/(b)*/)[1] === 'c' ||
		  // eslint-disable-next-line regexp/no-empty-group -- required for testing
		  'test'.split(/(?:)/, -1).length !== 4 ||
		  'ab'.split(/(?:ab)*/).length !== 2 ||
		  '.'.split(/(.?)(.?)/).length !== 4 ||
		  // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
		  '.'.split(/()()/).length > 1 ||
		  ''.split(/.?/).length;

		// @@split logic
		fixRegExpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
		  var internalSplit = '0'.split(undefined, 0).length ? function (separator, limit) {
		    return separator === undefined && limit === 0 ? [] : call(nativeSplit, this, separator, limit);
		  } : nativeSplit;

		  return [
		    // `String.prototype.split` method
		    // https://tc39.es/ecma262/#sec-string.prototype.split
		    function split(separator, limit) {
		      var O = requireObjectCoercible(this);
		      var splitter = isNullOrUndefined(separator) ? undefined : getMethod(separator, SPLIT);
		      return splitter
		        ? call(splitter, separator, O, limit)
		        : call(internalSplit, toString(O), separator, limit);
		    },
		    // `RegExp.prototype[@@split]` method
		    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
		    //
		    // NOTE: This cannot be properly polyfilled in engines that don't support
		    // the 'y' flag.
		    function (string, limit) {
		      var rx = anObject(this);
		      var S = toString(string);

		      if (!BUGGY) {
		        var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);
		        if (res.done) return res.value;
		      }

		      var C = speciesConstructor(rx, RegExp);
		      var unicodeMatching = rx.unicode;
		      var flags = (rx.ignoreCase ? 'i' : '') +
		                  (rx.multiline ? 'm' : '') +
		                  (rx.unicode ? 'u' : '') +
		                  (UNSUPPORTED_Y ? 'g' : 'y');
		      // ^(? + rx + ) is needed, in combination with some S slicing, to
		      // simulate the 'y' flag.
		      var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
		      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
		      if (lim === 0) return [];
		      if (S.length === 0) return regExpExec(splitter, S) === null ? [S] : [];
		      var p = 0;
		      var q = 0;
		      var A = [];
		      while (q < S.length) {
		        splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
		        var z = regExpExec(splitter, UNSUPPORTED_Y ? stringSlice(S, q) : S);
		        var e;
		        if (
		          z === null ||
		          (e = min(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
		        ) {
		          q = advanceStringIndex(S, q, unicodeMatching);
		        } else {
		          push(A, stringSlice(S, p, q));
		          if (A.length === lim) return A;
		          for (var i = 1; i <= z.length - 1; i++) {
		            push(A, z[i]);
		            if (A.length === lim) return A;
		          }
		          q = p = e;
		        }
		      }
		      push(A, stringSlice(S, p));
		      return A;
		    }
		  ];
		}, BUGGY || !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);
		return es_string_split;
	}

	requireEs_string_split();

	var es_string_startsWith = {};

	var hasRequiredEs_string_startsWith;

	function requireEs_string_startsWith () {
		if (hasRequiredEs_string_startsWith) return es_string_startsWith;
		hasRequiredEs_string_startsWith = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThisClause();
		var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
		var toLength = requireToLength();
		var toString = requireToString();
		var notARegExp = requireNotARegexp();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var correctIsRegExpLogic = requireCorrectIsRegexpLogic();
		var IS_PURE = requireIsPure();

		var stringSlice = uncurryThis(''.slice);
		var min = Math.min;

		var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith');
		// https://github.com/zloirock/core-js/pull/702
		var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
		  var descriptor = getOwnPropertyDescriptor(String.prototype, 'startsWith');
		  return descriptor && !descriptor.writable;
		}();

		// `String.prototype.startsWith` method
		// https://tc39.es/ecma262/#sec-string.prototype.startswith
		$({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
		  startsWith: function startsWith(searchString /* , position = 0 */) {
		    var that = toString(requireObjectCoercible(this));
		    notARegExp(searchString);
		    var index = toLength(min(arguments.length > 1 ? arguments[1] : undefined, that.length));
		    var search = toString(searchString);
		    return stringSlice(that, index, index + search.length) === search;
		  }
		});
		return es_string_startsWith;
	}

	requireEs_string_startsWith();

	var es_string_trim = {};

	var stringTrimForced;
	var hasRequiredStringTrimForced;

	function requireStringTrimForced () {
		if (hasRequiredStringTrimForced) return stringTrimForced;
		hasRequiredStringTrimForced = 1;
		var PROPER_FUNCTION_NAME = requireFunctionName().PROPER;
		var fails = requireFails();
		var whitespaces = requireWhitespaces();

		var non = '\u200B\u0085\u180E';

		// check that a method works with the correct list
		// of whitespaces and has a correct name
		stringTrimForced = function (METHOD_NAME) {
		  return fails(function () {
		    return !!whitespaces[METHOD_NAME]()
		      || non[METHOD_NAME]() !== non
		      || (PROPER_FUNCTION_NAME && whitespaces[METHOD_NAME].name !== METHOD_NAME);
		  });
		};
		return stringTrimForced;
	}

	var hasRequiredEs_string_trim;

	function requireEs_string_trim () {
		if (hasRequiredEs_string_trim) return es_string_trim;
		hasRequiredEs_string_trim = 1;
		var $ = require_export();
		var $trim = requireStringTrim().trim;
		var forcedStringTrimMethod = requireStringTrimForced();

		// `String.prototype.trim` method
		// https://tc39.es/ecma262/#sec-string.prototype.trim
		$({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
		  trim: function trim() {
		    return $trim(this);
		  }
		});
		return es_string_trim;
	}

	requireEs_string_trim();

	var es_string_anchor = {};

	var createHtml;
	var hasRequiredCreateHtml;

	function requireCreateHtml () {
		if (hasRequiredCreateHtml) return createHtml;
		hasRequiredCreateHtml = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var toString = requireToString();

		var quot = /"/g;
		var replace = uncurryThis(''.replace);

		// `CreateHTML` abstract operation
		// https://tc39.es/ecma262/#sec-createhtml
		createHtml = function (string, tag, attribute, value) {
		  var S = toString(requireObjectCoercible(string));
		  var p1 = '<' + tag;
		  if (attribute !== '') p1 += ' ' + attribute + '="' + replace(toString(value), quot, '&quot;') + '"';
		  return p1 + '>' + S + '</' + tag + '>';
		};
		return createHtml;
	}

	var stringHtmlForced;
	var hasRequiredStringHtmlForced;

	function requireStringHtmlForced () {
		if (hasRequiredStringHtmlForced) return stringHtmlForced;
		hasRequiredStringHtmlForced = 1;
		var fails = requireFails();

		// check the existence of a method, lowercase
		// of a tag and escaping quotes in arguments
		stringHtmlForced = function (METHOD_NAME) {
		  return fails(function () {
		    var test = ''[METHOD_NAME]('"');
		    return test !== test.toLowerCase() || test.split('"').length > 3;
		  });
		};
		return stringHtmlForced;
	}

	var hasRequiredEs_string_anchor;

	function requireEs_string_anchor () {
		if (hasRequiredEs_string_anchor) return es_string_anchor;
		hasRequiredEs_string_anchor = 1;
		var $ = require_export();
		var createHTML = requireCreateHtml();
		var forcedStringHTMLMethod = requireStringHtmlForced();

		// `String.prototype.anchor` method
		// https://tc39.es/ecma262/#sec-string.prototype.anchor
		$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('anchor') }, {
		  anchor: function anchor(name) {
		    return createHTML(this, 'a', 'name', name);
		  }
		});
		return es_string_anchor;
	}

	requireEs_string_anchor();

	var es_string_fixed = {};

	var hasRequiredEs_string_fixed;

	function requireEs_string_fixed () {
		if (hasRequiredEs_string_fixed) return es_string_fixed;
		hasRequiredEs_string_fixed = 1;
		var $ = require_export();
		var createHTML = requireCreateHtml();
		var forcedStringHTMLMethod = requireStringHtmlForced();

		// `String.prototype.fixed` method
		// https://tc39.es/ecma262/#sec-string.prototype.fixed
		$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('fixed') }, {
		  fixed: function fixed() {
		    return createHTML(this, 'tt', '', '');
		  }
		});
		return es_string_fixed;
	}

	requireEs_string_fixed();

	var es_string_link = {};

	var hasRequiredEs_string_link;

	function requireEs_string_link () {
		if (hasRequiredEs_string_link) return es_string_link;
		hasRequiredEs_string_link = 1;
		var $ = require_export();
		var createHTML = requireCreateHtml();
		var forcedStringHTMLMethod = requireStringHtmlForced();

		// `String.prototype.link` method
		// https://tc39.es/ecma262/#sec-string.prototype.link
		$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('link') }, {
		  link: function link(url) {
		    return createHTML(this, 'a', 'href', url);
		  }
		});
		return es_string_link;
	}

	requireEs_string_link();

	var es_string_small = {};

	var hasRequiredEs_string_small;

	function requireEs_string_small () {
		if (hasRequiredEs_string_small) return es_string_small;
		hasRequiredEs_string_small = 1;
		var $ = require_export();
		var createHTML = requireCreateHtml();
		var forcedStringHTMLMethod = requireStringHtmlForced();

		// `String.prototype.small` method
		// https://tc39.es/ecma262/#sec-string.prototype.small
		$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('small') }, {
		  small: function small() {
		    return createHTML(this, 'small', '', '');
		  }
		});
		return es_string_small;
	}

	requireEs_string_small();

	var es_string_sub = {};

	var hasRequiredEs_string_sub;

	function requireEs_string_sub () {
		if (hasRequiredEs_string_sub) return es_string_sub;
		hasRequiredEs_string_sub = 1;
		var $ = require_export();
		var createHTML = requireCreateHtml();
		var forcedStringHTMLMethod = requireStringHtmlForced();

		// `String.prototype.sub` method
		// https://tc39.es/ecma262/#sec-string.prototype.sub
		$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('sub') }, {
		  sub: function sub() {
		    return createHTML(this, 'sub', '', '');
		  }
		});
		return es_string_sub;
	}

	requireEs_string_sub();

	var es_weakMap = {};

	var es_weakMap_constructor = {};

	var collectionWeak;
	var hasRequiredCollectionWeak;

	function requireCollectionWeak () {
		if (hasRequiredCollectionWeak) return collectionWeak;
		hasRequiredCollectionWeak = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var defineBuiltIns = requireDefineBuiltIns();
		var getWeakData = requireInternalMetadata().getWeakData;
		var anInstance = requireAnInstance();
		var anObject = requireAnObject();
		var isNullOrUndefined = requireIsNullOrUndefined();
		var isObject = requireIsObject();
		var iterate = requireIterate();
		var ArrayIterationModule = requireArrayIteration();
		var hasOwn = requireHasOwnProperty();
		var InternalStateModule = requireInternalState();

		var setInternalState = InternalStateModule.set;
		var internalStateGetterFor = InternalStateModule.getterFor;
		var find = ArrayIterationModule.find;
		var findIndex = ArrayIterationModule.findIndex;
		var splice = uncurryThis([].splice);
		var id = 0;

		// fallback for uncaught frozen keys
		var uncaughtFrozenStore = function (state) {
		  return state.frozen || (state.frozen = new UncaughtFrozenStore());
		};

		var UncaughtFrozenStore = function () {
		  this.entries = [];
		};

		var findUncaughtFrozen = function (store, key) {
		  return find(store.entries, function (it) {
		    return it[0] === key;
		  });
		};

		UncaughtFrozenStore.prototype = {
		  get: function (key) {
		    var entry = findUncaughtFrozen(this, key);
		    if (entry) return entry[1];
		  },
		  has: function (key) {
		    return !!findUncaughtFrozen(this, key);
		  },
		  set: function (key, value) {
		    var entry = findUncaughtFrozen(this, key);
		    if (entry) entry[1] = value;
		    else this.entries.push([key, value]);
		  },
		  'delete': function (key) {
		    var index = findIndex(this.entries, function (it) {
		      return it[0] === key;
		    });
		    if (~index) splice(this.entries, index, 1);
		    return !!~index;
		  }
		};

		collectionWeak = {
		  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
		    var Constructor = wrapper(function (that, iterable) {
		      anInstance(that, Prototype);
		      setInternalState(that, {
		        type: CONSTRUCTOR_NAME,
		        id: id++,
		        frozen: null
		      });
		      if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
		    });

		    var Prototype = Constructor.prototype;

		    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

		    var define = function (that, key, value) {
		      var state = getInternalState(that);
		      var data = getWeakData(anObject(key), true);
		      if (data === true) uncaughtFrozenStore(state).set(key, value);
		      else data[state.id] = value;
		      return that;
		    };

		    defineBuiltIns(Prototype, {
		      // `{ WeakMap, WeakSet }.prototype.delete(key)` methods
		      // https://tc39.es/ecma262/#sec-weakmap.prototype.delete
		      // https://tc39.es/ecma262/#sec-weakset.prototype.delete
		      'delete': function (key) {
		        var state = getInternalState(this);
		        if (!isObject(key)) return false;
		        var data = getWeakData(key);
		        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
		        return data && hasOwn(data, state.id) && delete data[state.id];
		      },
		      // `{ WeakMap, WeakSet }.prototype.has(key)` methods
		      // https://tc39.es/ecma262/#sec-weakmap.prototype.has
		      // https://tc39.es/ecma262/#sec-weakset.prototype.has
		      has: function has(key) {
		        var state = getInternalState(this);
		        if (!isObject(key)) return false;
		        var data = getWeakData(key);
		        if (data === true) return uncaughtFrozenStore(state).has(key);
		        return data && hasOwn(data, state.id);
		      }
		    });

		    defineBuiltIns(Prototype, IS_MAP ? {
		      // `WeakMap.prototype.get(key)` method
		      // https://tc39.es/ecma262/#sec-weakmap.prototype.get
		      get: function get(key) {
		        var state = getInternalState(this);
		        if (isObject(key)) {
		          var data = getWeakData(key);
		          if (data === true) return uncaughtFrozenStore(state).get(key);
		          if (data) return data[state.id];
		        }
		      },
		      // `WeakMap.prototype.set(key, value)` method
		      // https://tc39.es/ecma262/#sec-weakmap.prototype.set
		      set: function set(key, value) {
		        return define(this, key, value);
		      }
		    } : {
		      // `WeakSet.prototype.add(value)` method
		      // https://tc39.es/ecma262/#sec-weakset.prototype.add
		      add: function add(value) {
		        return define(this, value, true);
		      }
		    });

		    return Constructor;
		  }
		};
		return collectionWeak;
	}

	var hasRequiredEs_weakMap_constructor;

	function requireEs_weakMap_constructor () {
		if (hasRequiredEs_weakMap_constructor) return es_weakMap_constructor;
		hasRequiredEs_weakMap_constructor = 1;
		var FREEZING = requireFreezing();
		var globalThis = requireGlobalThis();
		var uncurryThis = requireFunctionUncurryThis();
		var defineBuiltIns = requireDefineBuiltIns();
		var InternalMetadataModule = requireInternalMetadata();
		var collection = requireCollection();
		var collectionWeak = requireCollectionWeak();
		var isObject = requireIsObject();
		var enforceInternalState = requireInternalState().enforce;
		var fails = requireFails();
		var NATIVE_WEAK_MAP = requireWeakMapBasicDetection();

		var $Object = Object;
		// eslint-disable-next-line es/no-array-isarray -- safe
		var isArray = Array.isArray;
		// eslint-disable-next-line es/no-object-isextensible -- safe
		var isExtensible = $Object.isExtensible;
		// eslint-disable-next-line es/no-object-isfrozen -- safe
		var isFrozen = $Object.isFrozen;
		// eslint-disable-next-line es/no-object-issealed -- safe
		var isSealed = $Object.isSealed;
		// eslint-disable-next-line es/no-object-freeze -- safe
		var freeze = $Object.freeze;
		// eslint-disable-next-line es/no-object-seal -- safe
		var seal = $Object.seal;

		var IS_IE11 = !globalThis.ActiveXObject && 'ActiveXObject' in globalThis;
		var InternalWeakMap;

		var wrapper = function (init) {
		  return function WeakMap() {
		    return init(this, arguments.length ? arguments[0] : undefined);
		  };
		};

		// `WeakMap` constructor
		// https://tc39.es/ecma262/#sec-weakmap-constructor
		var $WeakMap = collection('WeakMap', wrapper, collectionWeak);
		var WeakMapPrototype = $WeakMap.prototype;
		var nativeSet = uncurryThis(WeakMapPrototype.set);

		// Chakra Edge bug: adding frozen arrays to WeakMap unfreeze them
		var hasMSEdgeFreezingBug = function () {
		  return FREEZING && fails(function () {
		    var frozenArray = freeze([]);
		    nativeSet(new $WeakMap(), frozenArray, 1);
		    return !isFrozen(frozenArray);
		  });
		};

		// IE11 WeakMap frozen keys fix
		// We can't use feature detection because it crash some old IE builds
		// https://github.com/zloirock/core-js/issues/485
		if (NATIVE_WEAK_MAP) if (IS_IE11) {
		  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
		  InternalMetadataModule.enable();
		  var nativeDelete = uncurryThis(WeakMapPrototype['delete']);
		  var nativeHas = uncurryThis(WeakMapPrototype.has);
		  var nativeGet = uncurryThis(WeakMapPrototype.get);
		  defineBuiltIns(WeakMapPrototype, {
		    'delete': function (key) {
		      if (isObject(key) && !isExtensible(key)) {
		        var state = enforceInternalState(this);
		        if (!state.frozen) state.frozen = new InternalWeakMap();
		        return nativeDelete(this, key) || state.frozen['delete'](key);
		      } return nativeDelete(this, key);
		    },
		    has: function has(key) {
		      if (isObject(key) && !isExtensible(key)) {
		        var state = enforceInternalState(this);
		        if (!state.frozen) state.frozen = new InternalWeakMap();
		        return nativeHas(this, key) || state.frozen.has(key);
		      } return nativeHas(this, key);
		    },
		    get: function get(key) {
		      if (isObject(key) && !isExtensible(key)) {
		        var state = enforceInternalState(this);
		        if (!state.frozen) state.frozen = new InternalWeakMap();
		        return nativeHas(this, key) ? nativeGet(this, key) : state.frozen.get(key);
		      } return nativeGet(this, key);
		    },
		    set: function set(key, value) {
		      if (isObject(key) && !isExtensible(key)) {
		        var state = enforceInternalState(this);
		        if (!state.frozen) state.frozen = new InternalWeakMap();
		        nativeHas(this, key) ? nativeSet(this, key, value) : state.frozen.set(key, value);
		      } else nativeSet(this, key, value);
		      return this;
		    }
		  });
		// Chakra Edge frozen keys fix
		} else if (hasMSEdgeFreezingBug()) {
		  defineBuiltIns(WeakMapPrototype, {
		    set: function set(key, value) {
		      var arrayIntegrityLevel;
		      if (isArray(key)) {
		        if (isFrozen(key)) arrayIntegrityLevel = freeze;
		        else if (isSealed(key)) arrayIntegrityLevel = seal;
		      }
		      nativeSet(this, key, value);
		      if (arrayIntegrityLevel) arrayIntegrityLevel(key);
		      return this;
		    }
		  });
		}
		return es_weakMap_constructor;
	}

	var hasRequiredEs_weakMap;

	function requireEs_weakMap () {
		if (hasRequiredEs_weakMap) return es_weakMap;
		hasRequiredEs_weakMap = 1;
		// TODO: Remove this module from `core-js@4` since it's replaced to module below
		requireEs_weakMap_constructor();
		return es_weakMap;
	}

	requireEs_weakMap();

	var es_weakSet = {};

	var es_weakSet_constructor = {};

	var hasRequiredEs_weakSet_constructor;

	function requireEs_weakSet_constructor () {
		if (hasRequiredEs_weakSet_constructor) return es_weakSet_constructor;
		hasRequiredEs_weakSet_constructor = 1;
		var collection = requireCollection();
		var collectionWeak = requireCollectionWeak();

		// `WeakSet` constructor
		// https://tc39.es/ecma262/#sec-weakset-constructor
		collection('WeakSet', function (init) {
		  return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
		}, collectionWeak);
		return es_weakSet_constructor;
	}

	var hasRequiredEs_weakSet;

	function requireEs_weakSet () {
		if (hasRequiredEs_weakSet) return es_weakSet;
		hasRequiredEs_weakSet = 1;
		// TODO: Remove this module from `core-js@4` since it's replaced to module below
		requireEs_weakSet_constructor();
		return es_weakSet;
	}

	requireEs_weakSet();

	var esnext_iterator_constructor = {};

	var es_iterator_constructor = {};

	var hasRequiredEs_iterator_constructor;

	function requireEs_iterator_constructor () {
		if (hasRequiredEs_iterator_constructor) return es_iterator_constructor;
		hasRequiredEs_iterator_constructor = 1;
		var $ = require_export();
		var globalThis = requireGlobalThis();
		var anInstance = requireAnInstance();
		var anObject = requireAnObject();
		var isCallable = requireIsCallable();
		var getPrototypeOf = requireObjectGetPrototypeOf();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var createProperty = requireCreateProperty();
		var fails = requireFails();
		var hasOwn = requireHasOwnProperty();
		var wellKnownSymbol = requireWellKnownSymbol();
		var IteratorPrototype = requireIteratorsCore().IteratorPrototype;
		var DESCRIPTORS = requireDescriptors();
		var IS_PURE = requireIsPure();

		var CONSTRUCTOR = 'constructor';
		var ITERATOR = 'Iterator';
		var TO_STRING_TAG = wellKnownSymbol('toStringTag');

		var $TypeError = TypeError;
		var NativeIterator = globalThis[ITERATOR];

		// FF56- have non-standard global helper `Iterator`
		var FORCED = IS_PURE
		  || !isCallable(NativeIterator)
		  || NativeIterator.prototype !== IteratorPrototype
		  // FF44- non-standard `Iterator` passes previous tests
		  || !fails(function () { NativeIterator({}); });

		var IteratorConstructor = function Iterator() {
		  anInstance(this, IteratorPrototype);
		  if (getPrototypeOf(this) === IteratorPrototype) throw new $TypeError('Abstract class Iterator not directly constructable');
		};

		var defineIteratorPrototypeAccessor = function (key, value) {
		  if (DESCRIPTORS) {
		    defineBuiltInAccessor(IteratorPrototype, key, {
		      configurable: true,
		      get: function () {
		        return value;
		      },
		      set: function (replacement) {
		        anObject(this);
		        if (this === IteratorPrototype) throw new $TypeError("You can't redefine this property");
		        if (hasOwn(this, key)) this[key] = replacement;
		        else createProperty(this, key, replacement);
		      }
		    });
		  } else IteratorPrototype[key] = value;
		};

		if (!hasOwn(IteratorPrototype, TO_STRING_TAG)) defineIteratorPrototypeAccessor(TO_STRING_TAG, ITERATOR);

		if (FORCED || !hasOwn(IteratorPrototype, CONSTRUCTOR) || IteratorPrototype[CONSTRUCTOR] === Object) {
		  defineIteratorPrototypeAccessor(CONSTRUCTOR, IteratorConstructor);
		}

		IteratorConstructor.prototype = IteratorPrototype;

		// `Iterator` constructor
		// https://tc39.es/ecma262/#sec-iterator
		$({ global: true, constructor: true, forced: FORCED }, {
		  Iterator: IteratorConstructor
		});
		return es_iterator_constructor;
	}

	var hasRequiredEsnext_iterator_constructor;

	function requireEsnext_iterator_constructor () {
		if (hasRequiredEsnext_iterator_constructor) return esnext_iterator_constructor;
		hasRequiredEsnext_iterator_constructor = 1;
		// TODO: Remove from `core-js@4`
		requireEs_iterator_constructor();
		return esnext_iterator_constructor;
	}

	requireEsnext_iterator_constructor();

	var esnext_iterator_every = {};

	var es_iterator_every = {};

	var hasRequiredEs_iterator_every;

	function requireEs_iterator_every () {
		if (hasRequiredEs_iterator_every) return es_iterator_every;
		hasRequiredEs_iterator_every = 1;
		var $ = require_export();
		var iterate = requireIterate();
		var aCallable = requireACallable();
		var anObject = requireAnObject();
		var getIteratorDirect = requireGetIteratorDirect();

		// `Iterator.prototype.every` method
		// https://tc39.es/ecma262/#sec-iterator.prototype.every
		$({ target: 'Iterator', proto: true, real: true }, {
		  every: function every(predicate) {
		    anObject(this);
		    aCallable(predicate);
		    var record = getIteratorDirect(this);
		    var counter = 0;
		    return !iterate(record, function (value, stop) {
		      if (!predicate(value, counter++)) return stop();
		    }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
		  }
		});
		return es_iterator_every;
	}

	var hasRequiredEsnext_iterator_every;

	function requireEsnext_iterator_every () {
		if (hasRequiredEsnext_iterator_every) return esnext_iterator_every;
		hasRequiredEsnext_iterator_every = 1;
		// TODO: Remove from `core-js@4`
		requireEs_iterator_every();
		return esnext_iterator_every;
	}

	requireEsnext_iterator_every();

	var esnext_iterator_filter = {};

	var es_iterator_filter = {};

	var iteratorCreateProxy;
	var hasRequiredIteratorCreateProxy;

	function requireIteratorCreateProxy () {
		if (hasRequiredIteratorCreateProxy) return iteratorCreateProxy;
		hasRequiredIteratorCreateProxy = 1;
		var call = requireFunctionCall();
		var create = requireObjectCreate();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var defineBuiltIns = requireDefineBuiltIns();
		var wellKnownSymbol = requireWellKnownSymbol();
		var InternalStateModule = requireInternalState();
		var getMethod = requireGetMethod();
		var IteratorPrototype = requireIteratorsCore().IteratorPrototype;
		var createIterResultObject = requireCreateIterResultObject();
		var iteratorClose = requireIteratorClose();

		var TO_STRING_TAG = wellKnownSymbol('toStringTag');
		var ITERATOR_HELPER = 'IteratorHelper';
		var WRAP_FOR_VALID_ITERATOR = 'WrapForValidIterator';
		var setInternalState = InternalStateModule.set;

		var createIteratorProxyPrototype = function (IS_ITERATOR) {
		  var getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER);

		  return defineBuiltIns(create(IteratorPrototype), {
		    next: function next() {
		      var state = getInternalState(this);
		      // for simplification:
		      //   for `%WrapForValidIteratorPrototype%.next` our `nextHandler` returns `IterResultObject`
		      //   for `%IteratorHelperPrototype%.next` - just a value
		      if (IS_ITERATOR) return state.nextHandler();
		      try {
		        var result = state.done ? undefined : state.nextHandler();
		        return createIterResultObject(result, state.done);
		      } catch (error) {
		        state.done = true;
		        throw error;
		      }
		    },
		    'return': function () {
		      var state = getInternalState(this);
		      var iterator = state.iterator;
		      state.done = true;
		      if (IS_ITERATOR) {
		        var returnMethod = getMethod(iterator, 'return');
		        return returnMethod ? call(returnMethod, iterator) : createIterResultObject(undefined, true);
		      }
		      if (state.inner) try {
		        iteratorClose(state.inner.iterator, 'normal');
		      } catch (error) {
		        return iteratorClose(iterator, 'throw', error);
		      }
		      if (iterator) iteratorClose(iterator, 'normal');
		      return createIterResultObject(undefined, true);
		    }
		  });
		};

		var WrapForValidIteratorPrototype = createIteratorProxyPrototype(true);
		var IteratorHelperPrototype = createIteratorProxyPrototype(false);

		createNonEnumerableProperty(IteratorHelperPrototype, TO_STRING_TAG, 'Iterator Helper');

		iteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
		  var IteratorProxy = function Iterator(record, state) {
		    if (state) {
		      state.iterator = record.iterator;
		      state.next = record.next;
		    } else state = record;
		    state.type = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER;
		    state.nextHandler = nextHandler;
		    state.counter = 0;
		    state.done = false;
		    setInternalState(this, state);
		  };

		  IteratorProxy.prototype = IS_ITERATOR ? WrapForValidIteratorPrototype : IteratorHelperPrototype;

		  return IteratorProxy;
		};
		return iteratorCreateProxy;
	}

	var hasRequiredEs_iterator_filter;

	function requireEs_iterator_filter () {
		if (hasRequiredEs_iterator_filter) return es_iterator_filter;
		hasRequiredEs_iterator_filter = 1;
		var $ = require_export();
		var call = requireFunctionCall();
		var aCallable = requireACallable();
		var anObject = requireAnObject();
		var getIteratorDirect = requireGetIteratorDirect();
		var createIteratorProxy = requireIteratorCreateProxy();
		var callWithSafeIterationClosing = requireCallWithSafeIterationClosing();
		var IS_PURE = requireIsPure();

		var IteratorProxy = createIteratorProxy(function () {
		  var iterator = this.iterator;
		  var predicate = this.predicate;
		  var next = this.next;
		  var result, done, value;
		  while (true) {
		    result = anObject(call(next, iterator));
		    done = this.done = !!result.done;
		    if (done) return;
		    value = result.value;
		    if (callWithSafeIterationClosing(iterator, predicate, [value, this.counter++], true)) return value;
		  }
		});

		// `Iterator.prototype.filter` method
		// https://tc39.es/ecma262/#sec-iterator.prototype.filter
		$({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
		  filter: function filter(predicate) {
		    anObject(this);
		    aCallable(predicate);
		    return new IteratorProxy(getIteratorDirect(this), {
		      predicate: predicate
		    });
		  }
		});
		return es_iterator_filter;
	}

	var hasRequiredEsnext_iterator_filter;

	function requireEsnext_iterator_filter () {
		if (hasRequiredEsnext_iterator_filter) return esnext_iterator_filter;
		hasRequiredEsnext_iterator_filter = 1;
		// TODO: Remove from `core-js@4`
		requireEs_iterator_filter();
		return esnext_iterator_filter;
	}

	requireEsnext_iterator_filter();

	var esnext_iterator_find = {};

	var es_iterator_find = {};

	var hasRequiredEs_iterator_find;

	function requireEs_iterator_find () {
		if (hasRequiredEs_iterator_find) return es_iterator_find;
		hasRequiredEs_iterator_find = 1;
		var $ = require_export();
		var iterate = requireIterate();
		var aCallable = requireACallable();
		var anObject = requireAnObject();
		var getIteratorDirect = requireGetIteratorDirect();

		// `Iterator.prototype.find` method
		// https://tc39.es/ecma262/#sec-iterator.prototype.find
		$({ target: 'Iterator', proto: true, real: true }, {
		  find: function find(predicate) {
		    anObject(this);
		    aCallable(predicate);
		    var record = getIteratorDirect(this);
		    var counter = 0;
		    return iterate(record, function (value, stop) {
		      if (predicate(value, counter++)) return stop(value);
		    }, { IS_RECORD: true, INTERRUPTED: true }).result;
		  }
		});
		return es_iterator_find;
	}

	var hasRequiredEsnext_iterator_find;

	function requireEsnext_iterator_find () {
		if (hasRequiredEsnext_iterator_find) return esnext_iterator_find;
		hasRequiredEsnext_iterator_find = 1;
		// TODO: Remove from `core-js@4`
		requireEs_iterator_find();
		return esnext_iterator_find;
	}

	requireEsnext_iterator_find();

	var esnext_iterator_flatMap = {};

	var es_iterator_flatMap = {};

	var getIteratorFlattenable;
	var hasRequiredGetIteratorFlattenable;

	function requireGetIteratorFlattenable () {
		if (hasRequiredGetIteratorFlattenable) return getIteratorFlattenable;
		hasRequiredGetIteratorFlattenable = 1;
		var call = requireFunctionCall();
		var anObject = requireAnObject();
		var getIteratorDirect = requireGetIteratorDirect();
		var getIteratorMethod = requireGetIteratorMethod();

		getIteratorFlattenable = function (obj, stringHandling) {
		  if (!stringHandling || typeof obj !== 'string') anObject(obj);
		  var method = getIteratorMethod(obj);
		  return getIteratorDirect(anObject(method !== undefined ? call(method, obj) : obj));
		};
		return getIteratorFlattenable;
	}

	var hasRequiredEs_iterator_flatMap;

	function requireEs_iterator_flatMap () {
		if (hasRequiredEs_iterator_flatMap) return es_iterator_flatMap;
		hasRequiredEs_iterator_flatMap = 1;
		var $ = require_export();
		var call = requireFunctionCall();
		var aCallable = requireACallable();
		var anObject = requireAnObject();
		var getIteratorDirect = requireGetIteratorDirect();
		var getIteratorFlattenable = requireGetIteratorFlattenable();
		var createIteratorProxy = requireIteratorCreateProxy();
		var iteratorClose = requireIteratorClose();
		var IS_PURE = requireIsPure();

		var IteratorProxy = createIteratorProxy(function () {
		  var iterator = this.iterator;
		  var mapper = this.mapper;
		  var result, inner;

		  while (true) {
		    if (inner = this.inner) try {
		      result = anObject(call(inner.next, inner.iterator));
		      if (!result.done) return result.value;
		      this.inner = null;
		    } catch (error) { iteratorClose(iterator, 'throw', error); }

		    result = anObject(call(this.next, iterator));

		    if (this.done = !!result.done) return;

		    try {
		      this.inner = getIteratorFlattenable(mapper(result.value, this.counter++), false);
		    } catch (error) { iteratorClose(iterator, 'throw', error); }
		  }
		});

		// `Iterator.prototype.flatMap` method
		// https://tc39.es/ecma262/#sec-iterator.prototype.flatmap
		$({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
		  flatMap: function flatMap(mapper) {
		    anObject(this);
		    aCallable(mapper);
		    return new IteratorProxy(getIteratorDirect(this), {
		      mapper: mapper,
		      inner: null
		    });
		  }
		});
		return es_iterator_flatMap;
	}

	var hasRequiredEsnext_iterator_flatMap;

	function requireEsnext_iterator_flatMap () {
		if (hasRequiredEsnext_iterator_flatMap) return esnext_iterator_flatMap;
		hasRequiredEsnext_iterator_flatMap = 1;
		// TODO: Remove from `core-js@4`
		requireEs_iterator_flatMap();
		return esnext_iterator_flatMap;
	}

	requireEsnext_iterator_flatMap();

	var esnext_iterator_forEach = {};

	var es_iterator_forEach = {};

	var hasRequiredEs_iterator_forEach;

	function requireEs_iterator_forEach () {
		if (hasRequiredEs_iterator_forEach) return es_iterator_forEach;
		hasRequiredEs_iterator_forEach = 1;
		var $ = require_export();
		var iterate = requireIterate();
		var aCallable = requireACallable();
		var anObject = requireAnObject();
		var getIteratorDirect = requireGetIteratorDirect();

		// `Iterator.prototype.forEach` method
		// https://tc39.es/ecma262/#sec-iterator.prototype.foreach
		$({ target: 'Iterator', proto: true, real: true }, {
		  forEach: function forEach(fn) {
		    anObject(this);
		    aCallable(fn);
		    var record = getIteratorDirect(this);
		    var counter = 0;
		    iterate(record, function (value) {
		      fn(value, counter++);
		    }, { IS_RECORD: true });
		  }
		});
		return es_iterator_forEach;
	}

	var hasRequiredEsnext_iterator_forEach;

	function requireEsnext_iterator_forEach () {
		if (hasRequiredEsnext_iterator_forEach) return esnext_iterator_forEach;
		hasRequiredEsnext_iterator_forEach = 1;
		// TODO: Remove from `core-js@4`
		requireEs_iterator_forEach();
		return esnext_iterator_forEach;
	}

	requireEsnext_iterator_forEach();

	var esnext_iterator_map = {};

	var es_iterator_map = {};

	var iteratorMap;
	var hasRequiredIteratorMap;

	function requireIteratorMap () {
		if (hasRequiredIteratorMap) return iteratorMap;
		hasRequiredIteratorMap = 1;
		var call = requireFunctionCall();
		var aCallable = requireACallable();
		var anObject = requireAnObject();
		var getIteratorDirect = requireGetIteratorDirect();
		var createIteratorProxy = requireIteratorCreateProxy();
		var callWithSafeIterationClosing = requireCallWithSafeIterationClosing();

		var IteratorProxy = createIteratorProxy(function () {
		  var iterator = this.iterator;
		  var result = anObject(call(this.next, iterator));
		  var done = this.done = !!result.done;
		  if (!done) return callWithSafeIterationClosing(iterator, this.mapper, [result.value, this.counter++], true);
		});

		// `Iterator.prototype.map` method
		// https://github.com/tc39/proposal-iterator-helpers
		iteratorMap = function map(mapper) {
		  anObject(this);
		  aCallable(mapper);
		  return new IteratorProxy(getIteratorDirect(this), {
		    mapper: mapper
		  });
		};
		return iteratorMap;
	}

	var hasRequiredEs_iterator_map;

	function requireEs_iterator_map () {
		if (hasRequiredEs_iterator_map) return es_iterator_map;
		hasRequiredEs_iterator_map = 1;
		var $ = require_export();
		var map = requireIteratorMap();
		var IS_PURE = requireIsPure();

		// `Iterator.prototype.map` method
		// https://tc39.es/ecma262/#sec-iterator.prototype.map
		$({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
		  map: map
		});
		return es_iterator_map;
	}

	var hasRequiredEsnext_iterator_map;

	function requireEsnext_iterator_map () {
		if (hasRequiredEsnext_iterator_map) return esnext_iterator_map;
		hasRequiredEsnext_iterator_map = 1;
		// TODO: Remove from `core-js@4`
		requireEs_iterator_map();
		return esnext_iterator_map;
	}

	requireEsnext_iterator_map();

	var esnext_iterator_reduce = {};

	var es_iterator_reduce = {};

	var hasRequiredEs_iterator_reduce;

	function requireEs_iterator_reduce () {
		if (hasRequiredEs_iterator_reduce) return es_iterator_reduce;
		hasRequiredEs_iterator_reduce = 1;
		var $ = require_export();
		var iterate = requireIterate();
		var aCallable = requireACallable();
		var anObject = requireAnObject();
		var getIteratorDirect = requireGetIteratorDirect();

		var $TypeError = TypeError;

		// `Iterator.prototype.reduce` method
		// https://tc39.es/ecma262/#sec-iterator.prototype.reduce
		$({ target: 'Iterator', proto: true, real: true }, {
		  reduce: function reduce(reducer /* , initialValue */) {
		    anObject(this);
		    aCallable(reducer);
		    var record = getIteratorDirect(this);
		    var noInitial = arguments.length < 2;
		    var accumulator = noInitial ? undefined : arguments[1];
		    var counter = 0;
		    iterate(record, function (value) {
		      if (noInitial) {
		        noInitial = false;
		        accumulator = value;
		      } else {
		        accumulator = reducer(accumulator, value, counter);
		      }
		      counter++;
		    }, { IS_RECORD: true });
		    if (noInitial) throw new $TypeError('Reduce of empty iterator with no initial value');
		    return accumulator;
		  }
		});
		return es_iterator_reduce;
	}

	var hasRequiredEsnext_iterator_reduce;

	function requireEsnext_iterator_reduce () {
		if (hasRequiredEsnext_iterator_reduce) return esnext_iterator_reduce;
		hasRequiredEsnext_iterator_reduce = 1;
		// TODO: Remove from `core-js@4`
		requireEs_iterator_reduce();
		return esnext_iterator_reduce;
	}

	requireEsnext_iterator_reduce();

	var esnext_iterator_some = {};

	var es_iterator_some = {};

	var hasRequiredEs_iterator_some;

	function requireEs_iterator_some () {
		if (hasRequiredEs_iterator_some) return es_iterator_some;
		hasRequiredEs_iterator_some = 1;
		var $ = require_export();
		var iterate = requireIterate();
		var aCallable = requireACallable();
		var anObject = requireAnObject();
		var getIteratorDirect = requireGetIteratorDirect();

		// `Iterator.prototype.some` method
		// https://tc39.es/ecma262/#sec-iterator.prototype.some
		$({ target: 'Iterator', proto: true, real: true }, {
		  some: function some(predicate) {
		    anObject(this);
		    aCallable(predicate);
		    var record = getIteratorDirect(this);
		    var counter = 0;
		    return iterate(record, function (value, stop) {
		      if (predicate(value, counter++)) return stop();
		    }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
		  }
		});
		return es_iterator_some;
	}

	var hasRequiredEsnext_iterator_some;

	function requireEsnext_iterator_some () {
		if (hasRequiredEsnext_iterator_some) return esnext_iterator_some;
		hasRequiredEsnext_iterator_some = 1;
		// TODO: Remove from `core-js@4`
		requireEs_iterator_some();
		return esnext_iterator_some;
	}

	requireEsnext_iterator_some();

	var esnext_json_parse = {};

	var parseJsonString;
	var hasRequiredParseJsonString;

	function requireParseJsonString () {
		if (hasRequiredParseJsonString) return parseJsonString;
		hasRequiredParseJsonString = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var hasOwn = requireHasOwnProperty();

		var $SyntaxError = SyntaxError;
		var $parseInt = parseInt;
		var fromCharCode = String.fromCharCode;
		var at = uncurryThis(''.charAt);
		var slice = uncurryThis(''.slice);
		var exec = uncurryThis(/./.exec);

		var codePoints = {
		  '\\"': '"',
		  '\\\\': '\\',
		  '\\/': '/',
		  '\\b': '\b',
		  '\\f': '\f',
		  '\\n': '\n',
		  '\\r': '\r',
		  '\\t': '\t'
		};

		var IS_4_HEX_DIGITS = /^[\da-f]{4}$/i;
		// eslint-disable-next-line regexp/no-control-character -- safe
		var IS_C0_CONTROL_CODE = /^[\u0000-\u001F]$/;

		parseJsonString = function (source, i) {
		  var unterminated = true;
		  var value = '';
		  while (i < source.length) {
		    var chr = at(source, i);
		    if (chr === '\\') {
		      var twoChars = slice(source, i, i + 2);
		      if (hasOwn(codePoints, twoChars)) {
		        value += codePoints[twoChars];
		        i += 2;
		      } else if (twoChars === '\\u') {
		        i += 2;
		        var fourHexDigits = slice(source, i, i + 4);
		        if (!exec(IS_4_HEX_DIGITS, fourHexDigits)) throw new $SyntaxError('Bad Unicode escape at: ' + i);
		        value += fromCharCode($parseInt(fourHexDigits, 16));
		        i += 4;
		      } else throw new $SyntaxError('Unknown escape sequence: "' + twoChars + '"');
		    } else if (chr === '"') {
		      unterminated = false;
		      i++;
		      break;
		    } else {
		      if (exec(IS_C0_CONTROL_CODE, chr)) throw new $SyntaxError('Bad control character in string literal at: ' + i);
		      value += chr;
		      i++;
		    }
		  }
		  if (unterminated) throw new $SyntaxError('Unterminated string at: ' + i);
		  return { value: value, end: i };
		};
		return parseJsonString;
	}

	var hasRequiredEsnext_json_parse;

	function requireEsnext_json_parse () {
		if (hasRequiredEsnext_json_parse) return esnext_json_parse;
		hasRequiredEsnext_json_parse = 1;
		var $ = require_export();
		var DESCRIPTORS = requireDescriptors();
		var globalThis = requireGlobalThis();
		var getBuiltIn = requireGetBuiltIn();
		var uncurryThis = requireFunctionUncurryThis();
		var call = requireFunctionCall();
		var isCallable = requireIsCallable();
		var isObject = requireIsObject();
		var isArray = requireIsArray();
		var hasOwn = requireHasOwnProperty();
		var toString = requireToString();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var createProperty = requireCreateProperty();
		var fails = requireFails();
		var parseJSONString = requireParseJsonString();
		var NATIVE_SYMBOL = requireSymbolConstructorDetection();

		var JSON = globalThis.JSON;
		var Number = globalThis.Number;
		var SyntaxError = globalThis.SyntaxError;
		var nativeParse = JSON && JSON.parse;
		var enumerableOwnProperties = getBuiltIn('Object', 'keys');
		// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
		var at = uncurryThis(''.charAt);
		var slice = uncurryThis(''.slice);
		var exec = uncurryThis(/./.exec);
		var push = uncurryThis([].push);

		var IS_DIGIT = /^\d$/;
		var IS_NON_ZERO_DIGIT = /^[1-9]$/;
		var IS_NUMBER_START = /^[\d-]$/;
		var IS_WHITESPACE = /^[\t\n\r ]$/;

		var PRIMITIVE = 0;
		var OBJECT = 1;

		var $parse = function (source, reviver) {
		  source = toString(source);
		  var context = new Context(source, 0);
		  var root = context.parse();
		  var value = root.value;
		  var endIndex = context.skip(IS_WHITESPACE, root.end);
		  if (endIndex < source.length) {
		    throw new SyntaxError('Unexpected extra character: "' + at(source, endIndex) + '" after the parsed data at: ' + endIndex);
		  }
		  return isCallable(reviver) ? internalize({ '': value }, '', reviver, root) : value;
		};

		var internalize = function (holder, name, reviver, node) {
		  var val = holder[name];
		  var unmodified = node && val === node.value;
		  var context = unmodified && typeof node.source == 'string' ? { source: node.source } : {};
		  var elementRecordsLen, keys, len, i, P;
		  if (isObject(val)) {
		    var nodeIsArray = isArray(val);
		    var nodes = unmodified ? node.nodes : nodeIsArray ? [] : {};
		    if (nodeIsArray) {
		      elementRecordsLen = nodes.length;
		      len = lengthOfArrayLike(val);
		      for (i = 0; i < len; i++) {
		        internalizeProperty(val, i, internalize(val, '' + i, reviver, i < elementRecordsLen ? nodes[i] : undefined));
		      }
		    } else {
		      keys = enumerableOwnProperties(val);
		      len = lengthOfArrayLike(keys);
		      for (i = 0; i < len; i++) {
		        P = keys[i];
		        internalizeProperty(val, P, internalize(val, P, reviver, hasOwn(nodes, P) ? nodes[P] : undefined));
		      }
		    }
		  }
		  return call(reviver, holder, name, val, context);
		};

		var internalizeProperty = function (object, key, value) {
		  if (DESCRIPTORS) {
		    var descriptor = getOwnPropertyDescriptor(object, key);
		    if (descriptor && !descriptor.configurable) return;
		  }
		  if (value === undefined) delete object[key];
		  else createProperty(object, key, value);
		};

		var Node = function (value, end, source, nodes) {
		  this.value = value;
		  this.end = end;
		  this.source = source;
		  this.nodes = nodes;
		};

		var Context = function (source, index) {
		  this.source = source;
		  this.index = index;
		};

		// https://www.json.org/json-en.html
		Context.prototype = {
		  fork: function (nextIndex) {
		    return new Context(this.source, nextIndex);
		  },
		  parse: function () {
		    var source = this.source;
		    var i = this.skip(IS_WHITESPACE, this.index);
		    var fork = this.fork(i);
		    var chr = at(source, i);
		    if (exec(IS_NUMBER_START, chr)) return fork.number();
		    switch (chr) {
		      case '{':
		        return fork.object();
		      case '[':
		        return fork.array();
		      case '"':
		        return fork.string();
		      case 't':
		        return fork.keyword(true);
		      case 'f':
		        return fork.keyword(false);
		      case 'n':
		        return fork.keyword(null);
		    } throw new SyntaxError('Unexpected character: "' + chr + '" at: ' + i);
		  },
		  node: function (type, value, start, end, nodes) {
		    return new Node(value, end, type ? null : slice(this.source, start, end), nodes);
		  },
		  object: function () {
		    var source = this.source;
		    var i = this.index + 1;
		    var expectKeypair = false;
		    var object = {};
		    var nodes = {};
		    while (i < source.length) {
		      i = this.until(['"', '}'], i);
		      if (at(source, i) === '}' && !expectKeypair) {
		        i++;
		        break;
		      }
		      // Parsing the key
		      var result = this.fork(i).string();
		      var key = result.value;
		      i = result.end;
		      i = this.until([':'], i) + 1;
		      // Parsing value
		      i = this.skip(IS_WHITESPACE, i);
		      result = this.fork(i).parse();
		      createProperty(nodes, key, result);
		      createProperty(object, key, result.value);
		      i = this.until([',', '}'], result.end);
		      var chr = at(source, i);
		      if (chr === ',') {
		        expectKeypair = true;
		        i++;
		      } else if (chr === '}') {
		        i++;
		        break;
		      }
		    }
		    return this.node(OBJECT, object, this.index, i, nodes);
		  },
		  array: function () {
		    var source = this.source;
		    var i = this.index + 1;
		    var expectElement = false;
		    var array = [];
		    var nodes = [];
		    while (i < source.length) {
		      i = this.skip(IS_WHITESPACE, i);
		      if (at(source, i) === ']' && !expectElement) {
		        i++;
		        break;
		      }
		      var result = this.fork(i).parse();
		      push(nodes, result);
		      push(array, result.value);
		      i = this.until([',', ']'], result.end);
		      if (at(source, i) === ',') {
		        expectElement = true;
		        i++;
		      } else if (at(source, i) === ']') {
		        i++;
		        break;
		      }
		    }
		    return this.node(OBJECT, array, this.index, i, nodes);
		  },
		  string: function () {
		    var index = this.index;
		    var parsed = parseJSONString(this.source, this.index + 1);
		    return this.node(PRIMITIVE, parsed.value, index, parsed.end);
		  },
		  number: function () {
		    var source = this.source;
		    var startIndex = this.index;
		    var i = startIndex;
		    if (at(source, i) === '-') i++;
		    if (at(source, i) === '0') i++;
		    else if (exec(IS_NON_ZERO_DIGIT, at(source, i))) i = this.skip(IS_DIGIT, i + 1);
		    else throw new SyntaxError('Failed to parse number at: ' + i);
		    if (at(source, i) === '.') i = this.skip(IS_DIGIT, i + 1);
		    if (at(source, i) === 'e' || at(source, i) === 'E') {
		      i++;
		      if (at(source, i) === '+' || at(source, i) === '-') i++;
		      var exponentStartIndex = i;
		      i = this.skip(IS_DIGIT, i);
		      if (exponentStartIndex === i) throw new SyntaxError("Failed to parse number's exponent value at: " + i);
		    }
		    return this.node(PRIMITIVE, Number(slice(source, startIndex, i)), startIndex, i);
		  },
		  keyword: function (value) {
		    var keyword = '' + value;
		    var index = this.index;
		    var endIndex = index + keyword.length;
		    if (slice(this.source, index, endIndex) !== keyword) throw new SyntaxError('Failed to parse value at: ' + index);
		    return this.node(PRIMITIVE, value, index, endIndex);
		  },
		  skip: function (regex, i) {
		    var source = this.source;
		    for (; i < source.length; i++) if (!exec(regex, at(source, i))) break;
		    return i;
		  },
		  until: function (array, i) {
		    i = this.skip(IS_WHITESPACE, i);
		    var chr = at(this.source, i);
		    for (var j = 0; j < array.length; j++) if (array[j] === chr) return i;
		    throw new SyntaxError('Unexpected character: "' + chr + '" at: ' + i);
		  }
		};

		var NO_SOURCE_SUPPORT = fails(function () {
		  var unsafeInt = '9007199254740993';
		  var source;
		  nativeParse(unsafeInt, function (key, value, context) {
		    source = context.source;
		  });
		  return source !== unsafeInt;
		});

		var PROPER_BASE_PARSE = NATIVE_SYMBOL && !fails(function () {
		  // Safari 9 bug
		  return 1 / nativeParse('-0 \t') !== -Infinity;
		});

		// `JSON.parse` method
		// https://tc39.es/ecma262/#sec-json.parse
		// https://github.com/tc39/proposal-json-parse-with-source
		$({ target: 'JSON', stat: true, forced: NO_SOURCE_SUPPORT }, {
		  parse: function parse(text, reviver) {
		    return PROPER_BASE_PARSE && !isCallable(reviver) ? nativeParse(text) : $parse(text, reviver);
		  }
		});
		return esnext_json_parse;
	}

	requireEsnext_json_parse();

	var web_domCollections_forEach = {};

	var domIterables;
	var hasRequiredDomIterables;

	function requireDomIterables () {
		if (hasRequiredDomIterables) return domIterables;
		hasRequiredDomIterables = 1;
		// iterable DOM collections
		// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
		domIterables = {
		  CSSRuleList: 0,
		  CSSStyleDeclaration: 0,
		  CSSValueList: 0,
		  ClientRectList: 0,
		  DOMRectList: 0,
		  DOMStringList: 0,
		  DOMTokenList: 1,
		  DataTransferItemList: 0,
		  FileList: 0,
		  HTMLAllCollection: 0,
		  HTMLCollection: 0,
		  HTMLFormElement: 0,
		  HTMLSelectElement: 0,
		  MediaList: 0,
		  MimeTypeArray: 0,
		  NamedNodeMap: 0,
		  NodeList: 1,
		  PaintRequestList: 0,
		  Plugin: 0,
		  PluginArray: 0,
		  SVGLengthList: 0,
		  SVGNumberList: 0,
		  SVGPathSegList: 0,
		  SVGPointList: 0,
		  SVGStringList: 0,
		  SVGTransformList: 0,
		  SourceBufferList: 0,
		  StyleSheetList: 0,
		  TextTrackCueList: 0,
		  TextTrackList: 0,
		  TouchList: 0
		};
		return domIterables;
	}

	var domTokenListPrototype;
	var hasRequiredDomTokenListPrototype;

	function requireDomTokenListPrototype () {
		if (hasRequiredDomTokenListPrototype) return domTokenListPrototype;
		hasRequiredDomTokenListPrototype = 1;
		// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
		var documentCreateElement = requireDocumentCreateElement();

		var classList = documentCreateElement('span').classList;
		var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

		domTokenListPrototype = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;
		return domTokenListPrototype;
	}

	var arrayForEach;
	var hasRequiredArrayForEach;

	function requireArrayForEach () {
		if (hasRequiredArrayForEach) return arrayForEach;
		hasRequiredArrayForEach = 1;
		var $forEach = requireArrayIteration().forEach;
		var arrayMethodIsStrict = requireArrayMethodIsStrict();

		var STRICT_METHOD = arrayMethodIsStrict('forEach');

		// `Array.prototype.forEach` method implementation
		// https://tc39.es/ecma262/#sec-array.prototype.foreach
		arrayForEach = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
		  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		// eslint-disable-next-line es/no-array-prototype-foreach -- safe
		} : [].forEach;
		return arrayForEach;
	}

	var hasRequiredWeb_domCollections_forEach;

	function requireWeb_domCollections_forEach () {
		if (hasRequiredWeb_domCollections_forEach) return web_domCollections_forEach;
		hasRequiredWeb_domCollections_forEach = 1;
		var globalThis = requireGlobalThis();
		var DOMIterables = requireDomIterables();
		var DOMTokenListPrototype = requireDomTokenListPrototype();
		var forEach = requireArrayForEach();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();

		var handlePrototype = function (CollectionPrototype) {
		  // some Chrome versions have non-configurable methods on DOMTokenList
		  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
		    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
		  } catch (error) {
		    CollectionPrototype.forEach = forEach;
		  }
		};

		for (var COLLECTION_NAME in DOMIterables) {
		  if (DOMIterables[COLLECTION_NAME]) {
		    handlePrototype(globalThis[COLLECTION_NAME] && globalThis[COLLECTION_NAME].prototype);
		  }
		}

		handlePrototype(DOMTokenListPrototype);
		return web_domCollections_forEach;
	}

	requireWeb_domCollections_forEach();

	var web_domCollections_iterator = {};

	var hasRequiredWeb_domCollections_iterator;

	function requireWeb_domCollections_iterator () {
		if (hasRequiredWeb_domCollections_iterator) return web_domCollections_iterator;
		hasRequiredWeb_domCollections_iterator = 1;
		var globalThis = requireGlobalThis();
		var DOMIterables = requireDomIterables();
		var DOMTokenListPrototype = requireDomTokenListPrototype();
		var ArrayIteratorMethods = requireEs_array_iterator();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var setToStringTag = requireSetToStringTag();
		var wellKnownSymbol = requireWellKnownSymbol();

		var ITERATOR = wellKnownSymbol('iterator');
		var ArrayValues = ArrayIteratorMethods.values;

		var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
		  if (CollectionPrototype) {
		    // some Chrome versions have non-configurable methods on DOMTokenList
		    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
		      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
		    } catch (error) {
		      CollectionPrototype[ITERATOR] = ArrayValues;
		    }
		    setToStringTag(CollectionPrototype, COLLECTION_NAME, true);
		    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
		      // some Chrome versions have non-configurable methods on DOMTokenList
		      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
		        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
		      } catch (error) {
		        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
		      }
		    }
		  }
		};

		for (var COLLECTION_NAME in DOMIterables) {
		  handlePrototype(globalThis[COLLECTION_NAME] && globalThis[COLLECTION_NAME].prototype, COLLECTION_NAME);
		}

		handlePrototype(DOMTokenListPrototype, 'DOMTokenList');
		return web_domCollections_iterator;
	}

	requireWeb_domCollections_iterator();

	var web_self = {};

	var hasRequiredWeb_self;

	function requireWeb_self () {
		if (hasRequiredWeb_self) return web_self;
		hasRequiredWeb_self = 1;
		var $ = require_export();
		var globalThis = requireGlobalThis();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var DESCRIPTORS = requireDescriptors();

		var $TypeError = TypeError;
		// eslint-disable-next-line es/no-object-defineproperty -- safe
		var defineProperty = Object.defineProperty;
		var INCORRECT_VALUE = globalThis.self !== globalThis;

		// `self` getter
		// https://html.spec.whatwg.org/multipage/window-object.html#dom-self
		try {
		  if (DESCRIPTORS) {
		    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		    var descriptor = Object.getOwnPropertyDescriptor(globalThis, 'self');
		    // some engines have `self`, but with incorrect descriptor
		    // https://github.com/denoland/deno/issues/15765
		    if (INCORRECT_VALUE || !descriptor || !descriptor.get || !descriptor.enumerable) {
		      defineBuiltInAccessor(globalThis, 'self', {
		        get: function self() {
		          return globalThis;
		        },
		        set: function self(value) {
		          if (this !== globalThis) throw new $TypeError('Illegal invocation');
		          defineProperty(globalThis, 'self', {
		            value: value,
		            writable: true,
		            configurable: true,
		            enumerable: true
		          });
		        },
		        configurable: true,
		        enumerable: true
		      });
		    }
		  } else $({ global: true, simple: true, forced: INCORRECT_VALUE }, {
		    self: globalThis
		  });
		} catch (error) { /* empty */ }
		return web_self;
	}

	requireWeb_self();

	var web_url = {};

	var web_url_constructor = {};

	var urlConstructorDetection;
	var hasRequiredUrlConstructorDetection;

	function requireUrlConstructorDetection () {
		if (hasRequiredUrlConstructorDetection) return urlConstructorDetection;
		hasRequiredUrlConstructorDetection = 1;
		var fails = requireFails();
		var wellKnownSymbol = requireWellKnownSymbol();
		var DESCRIPTORS = requireDescriptors();
		var IS_PURE = requireIsPure();

		var ITERATOR = wellKnownSymbol('iterator');

		urlConstructorDetection = !fails(function () {
		  // eslint-disable-next-line unicorn/relative-url-style -- required for testing
		  var url = new URL('b?a=1&b=2&c=3', 'https://a');
		  var params = url.searchParams;
		  var params2 = new URLSearchParams('a=1&a=2&b=3');
		  var result = '';
		  url.pathname = 'c%20d';
		  params.forEach(function (value, key) {
		    params['delete']('b');
		    result += key + value;
		  });
		  params2['delete']('a', 2);
		  // `undefined` case is a Chromium 117 bug
		  // https://bugs.chromium.org/p/v8/issues/detail?id=14222
		  params2['delete']('b', undefined);
		  return (IS_PURE && (!url.toJSON || !params2.has('a', 1) || params2.has('a', 2) || !params2.has('a', undefined) || params2.has('b')))
		    || (!params.size && (IS_PURE || !DESCRIPTORS))
		    || !params.sort
		    || url.href !== 'https://a/c%20d?a=1&c=3'
		    || params.get('c') !== '3'
		    || String(new URLSearchParams('?a=1')) !== 'a=1'
		    || !params[ITERATOR]
		    // throws in Edge
		    || new URL('https://a@b').username !== 'a'
		    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
		    // not punycoded in Edge
		    || new URL('https://тест').host !== 'xn--e1aybc'
		    // not escaped in Chrome 62-
		    || new URL('https://a#б').hash !== '#%D0%B1'
		    // fails in Chrome 66-
		    || result !== 'a1c3'
		    // throws in Safari
		    || new URL('https://x', undefined).host !== 'x';
		});
		return urlConstructorDetection;
	}

	var stringPunycodeToAscii;
	var hasRequiredStringPunycodeToAscii;

	function requireStringPunycodeToAscii () {
		if (hasRequiredStringPunycodeToAscii) return stringPunycodeToAscii;
		hasRequiredStringPunycodeToAscii = 1;
		// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
		var uncurryThis = requireFunctionUncurryThis();

		var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
		var base = 36;
		var tMin = 1;
		var tMax = 26;
		var skew = 38;
		var damp = 700;
		var initialBias = 72;
		var initialN = 128; // 0x80
		var delimiter = '-'; // '\x2D'
		var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
		var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
		var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
		var baseMinusTMin = base - tMin;

		var $RangeError = RangeError;
		var exec = uncurryThis(regexSeparators.exec);
		var floor = Math.floor;
		var fromCharCode = String.fromCharCode;
		var charCodeAt = uncurryThis(''.charCodeAt);
		var join = uncurryThis([].join);
		var push = uncurryThis([].push);
		var replace = uncurryThis(''.replace);
		var split = uncurryThis(''.split);
		var toLowerCase = uncurryThis(''.toLowerCase);

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 */
		var ucs2decode = function (string) {
		  var output = [];
		  var counter = 0;
		  var length = string.length;
		  while (counter < length) {
		    var value = charCodeAt(string, counter++);
		    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
		      // It's a high surrogate, and there is a next character.
		      var extra = charCodeAt(string, counter++);
		      if ((extra & 0xFC00) === 0xDC00) { // Low surrogate.
		        push(output, ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
		      } else {
		        // It's an unmatched surrogate; only append this code unit, in case the
		        // next code unit is the high surrogate of a surrogate pair.
		        push(output, value);
		        counter--;
		      }
		    } else {
		      push(output, value);
		    }
		  }
		  return output;
		};

		/**
		 * Converts a digit/integer into a basic code point.
		 */
		var digitToBasic = function (digit) {
		  //  0..25 map to ASCII a..z or A..Z
		  // 26..35 map to ASCII 0..9
		  return digit + 22 + 75 * (digit < 26);
		};

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * https://tools.ietf.org/html/rfc3492#section-3.4
		 */
		var adapt = function (delta, numPoints, firstTime) {
		  var k = 0;
		  delta = firstTime ? floor(delta / damp) : delta >> 1;
		  delta += floor(delta / numPoints);
		  while (delta > baseMinusTMin * tMax >> 1) {
		    delta = floor(delta / baseMinusTMin);
		    k += base;
		  }
		  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		};

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 */
		var encode = function (input) {
		  var output = [];

		  // Convert the input in UCS-2 to an array of Unicode code points.
		  input = ucs2decode(input);

		  // Cache the length.
		  var inputLength = input.length;

		  // Initialize the state.
		  var n = initialN;
		  var delta = 0;
		  var bias = initialBias;
		  var i, currentValue;

		  // Handle the basic code points.
		  for (i = 0; i < input.length; i++) {
		    currentValue = input[i];
		    if (currentValue < 0x80) {
		      push(output, fromCharCode(currentValue));
		    }
		  }

		  var basicLength = output.length; // number of basic code points.
		  var handledCPCount = basicLength; // number of code points that have been handled;

		  // Finish the basic string with a delimiter unless it's empty.
		  if (basicLength) {
		    push(output, delimiter);
		  }

		  // Main encoding loop:
		  while (handledCPCount < inputLength) {
		    // All non-basic code points < n have been handled already. Find the next larger one:
		    var m = maxInt;
		    for (i = 0; i < input.length; i++) {
		      currentValue = input[i];
		      if (currentValue >= n && currentValue < m) {
		        m = currentValue;
		      }
		    }

		    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
		    var handledCPCountPlusOne = handledCPCount + 1;
		    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
		      throw new $RangeError(OVERFLOW_ERROR);
		    }

		    delta += (m - n) * handledCPCountPlusOne;
		    n = m;

		    for (i = 0; i < input.length; i++) {
		      currentValue = input[i];
		      if (currentValue < n && ++delta > maxInt) {
		        throw new $RangeError(OVERFLOW_ERROR);
		      }
		      if (currentValue === n) {
		        // Represent delta as a generalized variable-length integer.
		        var q = delta;
		        var k = base;
		        while (true) {
		          var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
		          if (q < t) break;
		          var qMinusT = q - t;
		          var baseMinusT = base - t;
		          push(output, fromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
		          q = floor(qMinusT / baseMinusT);
		          k += base;
		        }

		        push(output, fromCharCode(digitToBasic(q)));
		        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
		        delta = 0;
		        handledCPCount++;
		      }
		    }

		    delta++;
		    n++;
		  }
		  return join(output, '');
		};

		stringPunycodeToAscii = function (input) {
		  var encoded = [];
		  var labels = split(replace(toLowerCase(input), regexSeparators, '\u002E'), '.');
		  var i, label;
		  for (i = 0; i < labels.length; i++) {
		    label = labels[i];
		    push(encoded, exec(regexNonASCII, label) ? 'xn--' + encode(label) : label);
		  }
		  return join(encoded, '.');
		};
		return stringPunycodeToAscii;
	}

	var es_string_fromCodePoint = {};

	var hasRequiredEs_string_fromCodePoint;

	function requireEs_string_fromCodePoint () {
		if (hasRequiredEs_string_fromCodePoint) return es_string_fromCodePoint;
		hasRequiredEs_string_fromCodePoint = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThis();
		var toAbsoluteIndex = requireToAbsoluteIndex();

		var $RangeError = RangeError;
		var fromCharCode = String.fromCharCode;
		// eslint-disable-next-line es/no-string-fromcodepoint -- required for testing
		var $fromCodePoint = String.fromCodePoint;
		var join = uncurryThis([].join);

		// length should be 1, old FF problem
		var INCORRECT_LENGTH = !!$fromCodePoint && $fromCodePoint.length !== 1;

		// `String.fromCodePoint` method
		// https://tc39.es/ecma262/#sec-string.fromcodepoint
		$({ target: 'String', stat: true, arity: 1, forced: INCORRECT_LENGTH }, {
		  // eslint-disable-next-line no-unused-vars -- required for `.length`
		  fromCodePoint: function fromCodePoint(x) {
		    var elements = [];
		    var length = arguments.length;
		    var i = 0;
		    var code;
		    while (length > i) {
		      code = +arguments[i++];
		      if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw new $RangeError(code + ' is not a valid code point');
		      elements[i] = code < 0x10000
		        ? fromCharCode(code)
		        : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00);
		    } return join(elements, '');
		  }
		});
		return es_string_fromCodePoint;
	}

	var web_urlSearchParams_constructor;
	var hasRequiredWeb_urlSearchParams_constructor;

	function requireWeb_urlSearchParams_constructor () {
		if (hasRequiredWeb_urlSearchParams_constructor) return web_urlSearchParams_constructor;
		hasRequiredWeb_urlSearchParams_constructor = 1;
		// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
		requireEs_array_iterator();
		requireEs_string_fromCodePoint();
		var $ = require_export();
		var globalThis = requireGlobalThis();
		var safeGetBuiltIn = requireSafeGetBuiltIn();
		var getBuiltIn = requireGetBuiltIn();
		var call = requireFunctionCall();
		var uncurryThis = requireFunctionUncurryThis();
		var DESCRIPTORS = requireDescriptors();
		var USE_NATIVE_URL = requireUrlConstructorDetection();
		var defineBuiltIn = requireDefineBuiltIn();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var defineBuiltIns = requireDefineBuiltIns();
		var setToStringTag = requireSetToStringTag();
		var createIteratorConstructor = requireIteratorCreateConstructor();
		var InternalStateModule = requireInternalState();
		var anInstance = requireAnInstance();
		var isCallable = requireIsCallable();
		var hasOwn = requireHasOwnProperty();
		var bind = requireFunctionBindContext();
		var classof = requireClassof();
		var anObject = requireAnObject();
		var isObject = requireIsObject();
		var $toString = requireToString();
		var create = requireObjectCreate();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();
		var getIterator = requireGetIterator();
		var getIteratorMethod = requireGetIteratorMethod();
		var createIterResultObject = requireCreateIterResultObject();
		var validateArgumentsLength = requireValidateArgumentsLength();
		var wellKnownSymbol = requireWellKnownSymbol();
		var arraySort = requireArraySort();

		var ITERATOR = wellKnownSymbol('iterator');
		var URL_SEARCH_PARAMS = 'URLSearchParams';
		var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
		var setInternalState = InternalStateModule.set;
		var getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS);
		var getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR);

		var nativeFetch = safeGetBuiltIn('fetch');
		var NativeRequest = safeGetBuiltIn('Request');
		var Headers = safeGetBuiltIn('Headers');
		var RequestPrototype = NativeRequest && NativeRequest.prototype;
		var HeadersPrototype = Headers && Headers.prototype;
		var TypeError = globalThis.TypeError;
		var encodeURIComponent = globalThis.encodeURIComponent;
		var fromCharCode = String.fromCharCode;
		var fromCodePoint = getBuiltIn('String', 'fromCodePoint');
		var $parseInt = parseInt;
		var charAt = uncurryThis(''.charAt);
		var join = uncurryThis([].join);
		var push = uncurryThis([].push);
		var replace = uncurryThis(''.replace);
		var shift = uncurryThis([].shift);
		var splice = uncurryThis([].splice);
		var split = uncurryThis(''.split);
		var stringSlice = uncurryThis(''.slice);
		var exec = uncurryThis(/./.exec);

		var plus = /\+/g;
		var FALLBACK_REPLACER = '\uFFFD';
		var VALID_HEX = /^[0-9a-f]+$/i;

		var parseHexOctet = function (string, start) {
		  var substr = stringSlice(string, start, start + 2);
		  if (!exec(VALID_HEX, substr)) return NaN;

		  return $parseInt(substr, 16);
		};

		var getLeadingOnes = function (octet) {
		  var count = 0;
		  for (var mask = 0x80; mask > 0 && (octet & mask) !== 0; mask >>= 1) {
		    count++;
		  }
		  return count;
		};

		var utf8Decode = function (octets) {
		  var codePoint = null;

		  switch (octets.length) {
		    case 1:
		      codePoint = octets[0];
		      break;
		    case 2:
		      codePoint = (octets[0] & 0x1F) << 6 | (octets[1] & 0x3F);
		      break;
		    case 3:
		      codePoint = (octets[0] & 0x0F) << 12 | (octets[1] & 0x3F) << 6 | (octets[2] & 0x3F);
		      break;
		    case 4:
		      codePoint = (octets[0] & 0x07) << 18 | (octets[1] & 0x3F) << 12 | (octets[2] & 0x3F) << 6 | (octets[3] & 0x3F);
		      break;
		  }

		  return codePoint > 0x10FFFF ? null : codePoint;
		};

		var decode = function (input) {
		  input = replace(input, plus, ' ');
		  var length = input.length;
		  var result = '';
		  var i = 0;

		  while (i < length) {
		    var decodedChar = charAt(input, i);

		    if (decodedChar === '%') {
		      if (charAt(input, i + 1) === '%' || i + 3 > length) {
		        result += '%';
		        i++;
		        continue;
		      }

		      var octet = parseHexOctet(input, i + 1);

		      // eslint-disable-next-line no-self-compare -- NaN check
		      if (octet !== octet) {
		        result += decodedChar;
		        i++;
		        continue;
		      }

		      i += 2;
		      var byteSequenceLength = getLeadingOnes(octet);

		      if (byteSequenceLength === 0) {
		        decodedChar = fromCharCode(octet);
		      } else {
		        if (byteSequenceLength === 1 || byteSequenceLength > 4) {
		          result += FALLBACK_REPLACER;
		          i++;
		          continue;
		        }

		        var octets = [octet];
		        var sequenceIndex = 1;

		        while (sequenceIndex < byteSequenceLength) {
		          i++;
		          if (i + 3 > length || charAt(input, i) !== '%') break;

		          var nextByte = parseHexOctet(input, i + 1);

		          // eslint-disable-next-line no-self-compare -- NaN check
		          if (nextByte !== nextByte) {
		            i += 3;
		            break;
		          }
		          if (nextByte > 191 || nextByte < 128) break;

		          push(octets, nextByte);
		          i += 2;
		          sequenceIndex++;
		        }

		        if (octets.length !== byteSequenceLength) {
		          result += FALLBACK_REPLACER;
		          continue;
		        }

		        var codePoint = utf8Decode(octets);
		        if (codePoint === null) {
		          result += FALLBACK_REPLACER;
		        } else {
		          decodedChar = fromCodePoint(codePoint);
		        }
		      }
		    }

		    result += decodedChar;
		    i++;
		  }

		  return result;
		};

		var find = /[!'()~]|%20/g;

		var replacements = {
		  '!': '%21',
		  "'": '%27',
		  '(': '%28',
		  ')': '%29',
		  '~': '%7E',
		  '%20': '+'
		};

		var replacer = function (match) {
		  return replacements[match];
		};

		var serialize = function (it) {
		  return replace(encodeURIComponent(it), find, replacer);
		};

		var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
		  setInternalState(this, {
		    type: URL_SEARCH_PARAMS_ITERATOR,
		    target: getInternalParamsState(params).entries,
		    index: 0,
		    kind: kind
		  });
		}, URL_SEARCH_PARAMS, function next() {
		  var state = getInternalIteratorState(this);
		  var target = state.target;
		  var index = state.index++;
		  if (!target || index >= target.length) {
		    state.target = null;
		    return createIterResultObject(undefined, true);
		  }
		  var entry = target[index];
		  switch (state.kind) {
		    case 'keys': return createIterResultObject(entry.key, false);
		    case 'values': return createIterResultObject(entry.value, false);
		  } return createIterResultObject([entry.key, entry.value], false);
		}, true);

		var URLSearchParamsState = function (init) {
		  this.entries = [];
		  this.url = null;

		  if (init !== undefined) {
		    if (isObject(init)) this.parseObject(init);
		    else this.parseQuery(typeof init == 'string' ? charAt(init, 0) === '?' ? stringSlice(init, 1) : init : $toString(init));
		  }
		};

		URLSearchParamsState.prototype = {
		  type: URL_SEARCH_PARAMS,
		  bindURL: function (url) {
		    this.url = url;
		    this.update();
		  },
		  parseObject: function (object) {
		    var entries = this.entries;
		    var iteratorMethod = getIteratorMethod(object);
		    var iterator, next, step, entryIterator, entryNext, first, second;

		    if (iteratorMethod) {
		      iterator = getIterator(object, iteratorMethod);
		      next = iterator.next;
		      while (!(step = call(next, iterator)).done) {
		        entryIterator = getIterator(anObject(step.value));
		        entryNext = entryIterator.next;
		        if (
		          (first = call(entryNext, entryIterator)).done ||
		          (second = call(entryNext, entryIterator)).done ||
		          !call(entryNext, entryIterator).done
		        ) throw new TypeError('Expected sequence with length 2');
		        push(entries, { key: $toString(first.value), value: $toString(second.value) });
		      }
		    } else for (var key in object) if (hasOwn(object, key)) {
		      push(entries, { key: key, value: $toString(object[key]) });
		    }
		  },
		  parseQuery: function (query) {
		    if (query) {
		      var entries = this.entries;
		      var attributes = split(query, '&');
		      var index = 0;
		      var attribute, entry;
		      while (index < attributes.length) {
		        attribute = attributes[index++];
		        if (attribute.length) {
		          entry = split(attribute, '=');
		          push(entries, {
		            key: decode(shift(entry)),
		            value: decode(join(entry, '='))
		          });
		        }
		      }
		    }
		  },
		  serialize: function () {
		    var entries = this.entries;
		    var result = [];
		    var index = 0;
		    var entry;
		    while (index < entries.length) {
		      entry = entries[index++];
		      push(result, serialize(entry.key) + '=' + serialize(entry.value));
		    } return join(result, '&');
		  },
		  update: function () {
		    this.entries.length = 0;
		    this.parseQuery(this.url.query);
		  },
		  updateURL: function () {
		    if (this.url) this.url.update();
		  }
		};

		// `URLSearchParams` constructor
		// https://url.spec.whatwg.org/#interface-urlsearchparams
		var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
		  anInstance(this, URLSearchParamsPrototype);
		  var init = arguments.length > 0 ? arguments[0] : undefined;
		  var state = setInternalState(this, new URLSearchParamsState(init));
		  if (!DESCRIPTORS) this.size = state.entries.length;
		};

		var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

		defineBuiltIns(URLSearchParamsPrototype, {
		  // `URLSearchParams.prototype.append` method
		  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
		  append: function append(name, value) {
		    var state = getInternalParamsState(this);
		    validateArgumentsLength(arguments.length, 2);
		    push(state.entries, { key: $toString(name), value: $toString(value) });
		    if (!DESCRIPTORS) this.length++;
		    state.updateURL();
		  },
		  // `URLSearchParams.prototype.delete` method
		  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
		  'delete': function (name /* , value */) {
		    var state = getInternalParamsState(this);
		    var length = validateArgumentsLength(arguments.length, 1);
		    var entries = state.entries;
		    var key = $toString(name);
		    var $value = length < 2 ? undefined : arguments[1];
		    var value = $value === undefined ? $value : $toString($value);
		    var index = 0;
		    while (index < entries.length) {
		      var entry = entries[index];
		      if (entry.key === key && (value === undefined || entry.value === value)) {
		        splice(entries, index, 1);
		        if (value !== undefined) break;
		      } else index++;
		    }
		    if (!DESCRIPTORS) this.size = entries.length;
		    state.updateURL();
		  },
		  // `URLSearchParams.prototype.get` method
		  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
		  get: function get(name) {
		    var entries = getInternalParamsState(this).entries;
		    validateArgumentsLength(arguments.length, 1);
		    var key = $toString(name);
		    var index = 0;
		    for (; index < entries.length; index++) {
		      if (entries[index].key === key) return entries[index].value;
		    }
		    return null;
		  },
		  // `URLSearchParams.prototype.getAll` method
		  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
		  getAll: function getAll(name) {
		    var entries = getInternalParamsState(this).entries;
		    validateArgumentsLength(arguments.length, 1);
		    var key = $toString(name);
		    var result = [];
		    var index = 0;
		    for (; index < entries.length; index++) {
		      if (entries[index].key === key) push(result, entries[index].value);
		    }
		    return result;
		  },
		  // `URLSearchParams.prototype.has` method
		  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
		  has: function has(name /* , value */) {
		    var entries = getInternalParamsState(this).entries;
		    var length = validateArgumentsLength(arguments.length, 1);
		    var key = $toString(name);
		    var $value = length < 2 ? undefined : arguments[1];
		    var value = $value === undefined ? $value : $toString($value);
		    var index = 0;
		    while (index < entries.length) {
		      var entry = entries[index++];
		      if (entry.key === key && (value === undefined || entry.value === value)) return true;
		    }
		    return false;
		  },
		  // `URLSearchParams.prototype.set` method
		  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
		  set: function set(name, value) {
		    var state = getInternalParamsState(this);
		    validateArgumentsLength(arguments.length, 1);
		    var entries = state.entries;
		    var found = false;
		    var key = $toString(name);
		    var val = $toString(value);
		    var index = 0;
		    var entry;
		    for (; index < entries.length; index++) {
		      entry = entries[index];
		      if (entry.key === key) {
		        if (found) splice(entries, index--, 1);
		        else {
		          found = true;
		          entry.value = val;
		        }
		      }
		    }
		    if (!found) push(entries, { key: key, value: val });
		    if (!DESCRIPTORS) this.size = entries.length;
		    state.updateURL();
		  },
		  // `URLSearchParams.prototype.sort` method
		  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
		  sort: function sort() {
		    var state = getInternalParamsState(this);
		    arraySort(state.entries, function (a, b) {
		      return a.key > b.key ? 1 : -1;
		    });
		    state.updateURL();
		  },
		  // `URLSearchParams.prototype.forEach` method
		  forEach: function forEach(callback /* , thisArg */) {
		    var entries = getInternalParamsState(this).entries;
		    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined);
		    var index = 0;
		    var entry;
		    while (index < entries.length) {
		      entry = entries[index++];
		      boundFunction(entry.value, entry.key, this);
		    }
		  },
		  // `URLSearchParams.prototype.keys` method
		  keys: function keys() {
		    return new URLSearchParamsIterator(this, 'keys');
		  },
		  // `URLSearchParams.prototype.values` method
		  values: function values() {
		    return new URLSearchParamsIterator(this, 'values');
		  },
		  // `URLSearchParams.prototype.entries` method
		  entries: function entries() {
		    return new URLSearchParamsIterator(this, 'entries');
		  }
		}, { enumerable: true });

		// `URLSearchParams.prototype[@@iterator]` method
		defineBuiltIn(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries, { name: 'entries' });

		// `URLSearchParams.prototype.toString` method
		// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
		defineBuiltIn(URLSearchParamsPrototype, 'toString', function toString() {
		  return getInternalParamsState(this).serialize();
		}, { enumerable: true });

		// `URLSearchParams.prototype.size` getter
		// https://github.com/whatwg/url/pull/734
		if (DESCRIPTORS) defineBuiltInAccessor(URLSearchParamsPrototype, 'size', {
		  get: function size() {
		    return getInternalParamsState(this).entries.length;
		  },
		  configurable: true,
		  enumerable: true
		});

		setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

		$({ global: true, constructor: true, forced: !USE_NATIVE_URL }, {
		  URLSearchParams: URLSearchParamsConstructor
		});

		// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
		if (!USE_NATIVE_URL && isCallable(Headers)) {
		  var headersHas = uncurryThis(HeadersPrototype.has);
		  var headersSet = uncurryThis(HeadersPrototype.set);

		  var wrapRequestOptions = function (init) {
		    if (isObject(init)) {
		      var body = init.body;
		      var headers;
		      if (classof(body) === URL_SEARCH_PARAMS) {
		        headers = init.headers ? new Headers(init.headers) : new Headers();
		        if (!headersHas(headers, 'content-type')) {
		          headersSet(headers, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
		        }
		        return create(init, {
		          body: createPropertyDescriptor(0, $toString(body)),
		          headers: createPropertyDescriptor(0, headers)
		        });
		      }
		    } return init;
		  };

		  if (isCallable(nativeFetch)) {
		    $({ global: true, enumerable: true, dontCallGetSet: true, forced: true }, {
		      fetch: function fetch(input /* , init */) {
		        return nativeFetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
		      }
		    });
		  }

		  if (isCallable(NativeRequest)) {
		    var RequestConstructor = function Request(input /* , init */) {
		      anInstance(this, RequestPrototype);
		      return new NativeRequest(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
		    };

		    RequestPrototype.constructor = RequestConstructor;
		    RequestConstructor.prototype = RequestPrototype;

		    $({ global: true, constructor: true, dontCallGetSet: true, forced: true }, {
		      Request: RequestConstructor
		    });
		  }
		}

		web_urlSearchParams_constructor = {
		  URLSearchParams: URLSearchParamsConstructor,
		  getState: getInternalParamsState
		};
		return web_urlSearchParams_constructor;
	}

	var hasRequiredWeb_url_constructor;

	function requireWeb_url_constructor () {
		if (hasRequiredWeb_url_constructor) return web_url_constructor;
		hasRequiredWeb_url_constructor = 1;
		// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
		requireEs_string_iterator();
		var $ = require_export();
		var DESCRIPTORS = requireDescriptors();
		var USE_NATIVE_URL = requireUrlConstructorDetection();
		var globalThis = requireGlobalThis();
		var bind = requireFunctionBindContext();
		var uncurryThis = requireFunctionUncurryThis();
		var defineBuiltIn = requireDefineBuiltIn();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var anInstance = requireAnInstance();
		var hasOwn = requireHasOwnProperty();
		var assign = requireObjectAssign();
		var arrayFrom = requireArrayFrom();
		var arraySlice = requireArraySlice();
		var codeAt = requireStringMultibyte().codeAt;
		var toASCII = requireStringPunycodeToAscii();
		var $toString = requireToString();
		var setToStringTag = requireSetToStringTag();
		var validateArgumentsLength = requireValidateArgumentsLength();
		var URLSearchParamsModule = requireWeb_urlSearchParams_constructor();
		var InternalStateModule = requireInternalState();

		var setInternalState = InternalStateModule.set;
		var getInternalURLState = InternalStateModule.getterFor('URL');
		var URLSearchParams = URLSearchParamsModule.URLSearchParams;
		var getInternalSearchParamsState = URLSearchParamsModule.getState;

		var NativeURL = globalThis.URL;
		var TypeError = globalThis.TypeError;
		var parseInt = globalThis.parseInt;
		var floor = Math.floor;
		var pow = Math.pow;
		var charAt = uncurryThis(''.charAt);
		var exec = uncurryThis(/./.exec);
		var join = uncurryThis([].join);
		var numberToString = uncurryThis(1.0.toString);
		var pop = uncurryThis([].pop);
		var push = uncurryThis([].push);
		var replace = uncurryThis(''.replace);
		var shift = uncurryThis([].shift);
		var split = uncurryThis(''.split);
		var stringSlice = uncurryThis(''.slice);
		var toLowerCase = uncurryThis(''.toLowerCase);
		var unshift = uncurryThis([].unshift);

		var INVALID_AUTHORITY = 'Invalid authority';
		var INVALID_SCHEME = 'Invalid scheme';
		var INVALID_HOST = 'Invalid host';
		var INVALID_PORT = 'Invalid port';

		var ALPHA = /[a-z]/i;
		// eslint-disable-next-line regexp/no-obscure-range -- safe
		var ALPHANUMERIC = /[\d+-.a-z]/i;
		var DIGIT = /\d/;
		var HEX_START = /^0x/i;
		var OCT = /^[0-7]+$/;
		var DEC = /^\d+$/;
		var HEX = /^[\da-f]+$/i;
		/* eslint-disable regexp/no-control-character -- safe */
		var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
		var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
		var LEADING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+/;
		var TRAILING_C0_CONTROL_OR_SPACE = /(^|[^\u0000-\u0020])[\u0000-\u0020]+$/;
		var TAB_AND_NEW_LINE = /[\t\n\r]/g;
		/* eslint-enable regexp/no-control-character -- safe */
		var EOF;

		// https://url.spec.whatwg.org/#ipv4-number-parser
		var parseIPv4 = function (input) {
		  var parts = split(input, '.');
		  var partsLength, numbers, index, part, radix, number, ipv4;
		  if (parts.length && parts[parts.length - 1] === '') {
		    parts.length--;
		  }
		  partsLength = parts.length;
		  if (partsLength > 4) return input;
		  numbers = [];
		  for (index = 0; index < partsLength; index++) {
		    part = parts[index];
		    if (part === '') return input;
		    radix = 10;
		    if (part.length > 1 && charAt(part, 0) === '0') {
		      radix = exec(HEX_START, part) ? 16 : 8;
		      part = stringSlice(part, radix === 8 ? 1 : 2);
		    }
		    if (part === '') {
		      number = 0;
		    } else {
		      if (!exec(radix === 10 ? DEC : radix === 8 ? OCT : HEX, part)) return input;
		      number = parseInt(part, radix);
		    }
		    push(numbers, number);
		  }
		  for (index = 0; index < partsLength; index++) {
		    number = numbers[index];
		    if (index === partsLength - 1) {
		      if (number >= pow(256, 5 - partsLength)) return null;
		    } else if (number > 255) return null;
		  }
		  ipv4 = pop(numbers);
		  for (index = 0; index < numbers.length; index++) {
		    ipv4 += numbers[index] * pow(256, 3 - index);
		  }
		  return ipv4;
		};

		// https://url.spec.whatwg.org/#concept-ipv6-parser
		// eslint-disable-next-line max-statements -- TODO
		var parseIPv6 = function (input) {
		  var address = [0, 0, 0, 0, 0, 0, 0, 0];
		  var pieceIndex = 0;
		  var compress = null;
		  var pointer = 0;
		  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

		  var chr = function () {
		    return charAt(input, pointer);
		  };

		  if (chr() === ':') {
		    if (charAt(input, 1) !== ':') return;
		    pointer += 2;
		    pieceIndex++;
		    compress = pieceIndex;
		  }
		  while (chr()) {
		    if (pieceIndex === 8) return;
		    if (chr() === ':') {
		      if (compress !== null) return;
		      pointer++;
		      pieceIndex++;
		      compress = pieceIndex;
		      continue;
		    }
		    value = length = 0;
		    while (length < 4 && exec(HEX, chr())) {
		      value = value * 16 + parseInt(chr(), 16);
		      pointer++;
		      length++;
		    }
		    if (chr() === '.') {
		      if (length === 0) return;
		      pointer -= length;
		      if (pieceIndex > 6) return;
		      numbersSeen = 0;
		      while (chr()) {
		        ipv4Piece = null;
		        if (numbersSeen > 0) {
		          if (chr() === '.' && numbersSeen < 4) pointer++;
		          else return;
		        }
		        if (!exec(DIGIT, chr())) return;
		        while (exec(DIGIT, chr())) {
		          number = parseInt(chr(), 10);
		          if (ipv4Piece === null) ipv4Piece = number;
		          else if (ipv4Piece === 0) return;
		          else ipv4Piece = ipv4Piece * 10 + number;
		          if (ipv4Piece > 255) return;
		          pointer++;
		        }
		        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
		        numbersSeen++;
		        if (numbersSeen === 2 || numbersSeen === 4) pieceIndex++;
		      }
		      if (numbersSeen !== 4) return;
		      break;
		    } else if (chr() === ':') {
		      pointer++;
		      if (!chr()) return;
		    } else if (chr()) return;
		    address[pieceIndex++] = value;
		  }
		  if (compress !== null) {
		    swaps = pieceIndex - compress;
		    pieceIndex = 7;
		    while (pieceIndex !== 0 && swaps > 0) {
		      swap = address[pieceIndex];
		      address[pieceIndex--] = address[compress + swaps - 1];
		      address[compress + --swaps] = swap;
		    }
		  } else if (pieceIndex !== 8) return;
		  return address;
		};

		var findLongestZeroSequence = function (ipv6) {
		  var maxIndex = null;
		  var maxLength = 1;
		  var currStart = null;
		  var currLength = 0;
		  var index = 0;
		  for (; index < 8; index++) {
		    if (ipv6[index] !== 0) {
		      if (currLength > maxLength) {
		        maxIndex = currStart;
		        maxLength = currLength;
		      }
		      currStart = null;
		      currLength = 0;
		    } else {
		      if (currStart === null) currStart = index;
		      ++currLength;
		    }
		  }
		  return currLength > maxLength ? currStart : maxIndex;
		};

		// https://url.spec.whatwg.org/#host-serializing
		var serializeHost = function (host) {
		  var result, index, compress, ignore0;

		  // ipv4
		  if (typeof host == 'number') {
		    result = [];
		    for (index = 0; index < 4; index++) {
		      unshift(result, host % 256);
		      host = floor(host / 256);
		    }
		    return join(result, '.');
		  }

		  // ipv6
		  if (typeof host == 'object') {
		    result = '';
		    compress = findLongestZeroSequence(host);
		    for (index = 0; index < 8; index++) {
		      if (ignore0 && host[index] === 0) continue;
		      if (ignore0) ignore0 = false;
		      if (compress === index) {
		        result += index ? ':' : '::';
		        ignore0 = true;
		      } else {
		        result += numberToString(host[index], 16);
		        if (index < 7) result += ':';
		      }
		    }
		    return '[' + result + ']';
		  }

		  return host;
		};

		var C0ControlPercentEncodeSet = {};
		var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
		  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
		});
		var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
		  '#': 1, '?': 1, '{': 1, '}': 1
		});
		var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
		  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
		});

		var percentEncode = function (chr, set) {
		  var code = codeAt(chr, 0);
		  return code > 0x20 && code < 0x7F && !hasOwn(set, chr) ? chr : encodeURIComponent(chr);
		};

		// https://url.spec.whatwg.org/#special-scheme
		var specialSchemes = {
		  ftp: 21,
		  file: null,
		  http: 80,
		  https: 443,
		  ws: 80,
		  wss: 443
		};

		// https://url.spec.whatwg.org/#windows-drive-letter
		var isWindowsDriveLetter = function (string, normalized) {
		  var second;
		  return string.length === 2 && exec(ALPHA, charAt(string, 0))
		    && ((second = charAt(string, 1)) === ':' || (!normalized && second === '|'));
		};

		// https://url.spec.whatwg.org/#start-with-a-windows-drive-letter
		var startsWithWindowsDriveLetter = function (string) {
		  var third;
		  return string.length > 1 && isWindowsDriveLetter(stringSlice(string, 0, 2)) && (
		    string.length === 2 ||
		    ((third = charAt(string, 2)) === '/' || third === '\\' || third === '?' || third === '#')
		  );
		};

		// https://url.spec.whatwg.org/#single-dot-path-segment
		var isSingleDot = function (segment) {
		  return segment === '.' || toLowerCase(segment) === '%2e';
		};

		// https://url.spec.whatwg.org/#double-dot-path-segment
		var isDoubleDot = function (segment) {
		  segment = toLowerCase(segment);
		  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
		};

		// States:
		var SCHEME_START = {};
		var SCHEME = {};
		var NO_SCHEME = {};
		var SPECIAL_RELATIVE_OR_AUTHORITY = {};
		var PATH_OR_AUTHORITY = {};
		var RELATIVE = {};
		var RELATIVE_SLASH = {};
		var SPECIAL_AUTHORITY_SLASHES = {};
		var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
		var AUTHORITY = {};
		var HOST = {};
		var HOSTNAME = {};
		var PORT = {};
		var FILE = {};
		var FILE_SLASH = {};
		var FILE_HOST = {};
		var PATH_START = {};
		var PATH = {};
		var CANNOT_BE_A_BASE_URL_PATH = {};
		var QUERY = {};
		var FRAGMENT = {};

		var URLState = function (url, isBase, base) {
		  var urlString = $toString(url);
		  var baseState, failure, searchParams;
		  if (isBase) {
		    failure = this.parse(urlString);
		    if (failure) throw new TypeError(failure);
		    this.searchParams = null;
		  } else {
		    if (base !== undefined) baseState = new URLState(base, true);
		    failure = this.parse(urlString, null, baseState);
		    if (failure) throw new TypeError(failure);
		    searchParams = getInternalSearchParamsState(new URLSearchParams());
		    searchParams.bindURL(this);
		    this.searchParams = searchParams;
		  }
		};

		URLState.prototype = {
		  type: 'URL',
		  // https://url.spec.whatwg.org/#url-parsing
		  // eslint-disable-next-line max-statements -- TODO
		  parse: function (input, stateOverride, base) {
		    var url = this;
		    var state = stateOverride || SCHEME_START;
		    var pointer = 0;
		    var buffer = '';
		    var seenAt = false;
		    var seenBracket = false;
		    var seenPasswordToken = false;
		    var codePoints, chr, bufferCodePoints, failure;

		    input = $toString(input);

		    if (!stateOverride) {
		      url.scheme = '';
		      url.username = '';
		      url.password = '';
		      url.host = null;
		      url.port = null;
		      url.path = [];
		      url.query = null;
		      url.fragment = null;
		      url.cannotBeABaseURL = false;
		      input = replace(input, LEADING_C0_CONTROL_OR_SPACE, '');
		      input = replace(input, TRAILING_C0_CONTROL_OR_SPACE, '$1');
		    }

		    input = replace(input, TAB_AND_NEW_LINE, '');

		    codePoints = arrayFrom(input);

		    while (pointer <= codePoints.length) {
		      chr = codePoints[pointer];
		      switch (state) {
		        case SCHEME_START:
		          if (chr && exec(ALPHA, chr)) {
		            buffer += toLowerCase(chr);
		            state = SCHEME;
		          } else if (!stateOverride) {
		            state = NO_SCHEME;
		            continue;
		          } else return INVALID_SCHEME;
		          break;

		        case SCHEME:
		          if (chr && (exec(ALPHANUMERIC, chr) || chr === '+' || chr === '-' || chr === '.')) {
		            buffer += toLowerCase(chr);
		          } else if (chr === ':') {
		            if (stateOverride && (
		              (url.isSpecial() !== hasOwn(specialSchemes, buffer)) ||
		              (buffer === 'file' && (url.includesCredentials() || url.port !== null)) ||
		              (url.scheme === 'file' && !url.host)
		            )) return;
		            url.scheme = buffer;
		            if (stateOverride) {
		              if (url.isSpecial() && specialSchemes[url.scheme] === url.port) url.port = null;
		              return;
		            }
		            buffer = '';
		            if (url.scheme === 'file') {
		              state = FILE;
		            } else if (url.isSpecial() && base && base.scheme === url.scheme) {
		              state = SPECIAL_RELATIVE_OR_AUTHORITY;
		            } else if (url.isSpecial()) {
		              state = SPECIAL_AUTHORITY_SLASHES;
		            } else if (codePoints[pointer + 1] === '/') {
		              state = PATH_OR_AUTHORITY;
		              pointer++;
		            } else {
		              url.cannotBeABaseURL = true;
		              push(url.path, '');
		              state = CANNOT_BE_A_BASE_URL_PATH;
		            }
		          } else if (!stateOverride) {
		            buffer = '';
		            state = NO_SCHEME;
		            pointer = 0;
		            continue;
		          } else return INVALID_SCHEME;
		          break;

		        case NO_SCHEME:
		          if (!base || (base.cannotBeABaseURL && chr !== '#')) return INVALID_SCHEME;
		          if (base.cannotBeABaseURL && chr === '#') {
		            url.scheme = base.scheme;
		            url.path = arraySlice(base.path);
		            url.query = base.query;
		            url.fragment = '';
		            url.cannotBeABaseURL = true;
		            state = FRAGMENT;
		            break;
		          }
		          state = base.scheme === 'file' ? FILE : RELATIVE;
		          continue;

		        case SPECIAL_RELATIVE_OR_AUTHORITY:
		          if (chr === '/' && codePoints[pointer + 1] === '/') {
		            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
		            pointer++;
		          } else {
		            state = RELATIVE;
		            continue;
		          } break;

		        case PATH_OR_AUTHORITY:
		          if (chr === '/') {
		            state = AUTHORITY;
		            break;
		          } else {
		            state = PATH;
		            continue;
		          }

		        case RELATIVE:
		          url.scheme = base.scheme;
		          if (chr === EOF) {
		            url.username = base.username;
		            url.password = base.password;
		            url.host = base.host;
		            url.port = base.port;
		            url.path = arraySlice(base.path);
		            url.query = base.query;
		          } else if (chr === '/' || (chr === '\\' && url.isSpecial())) {
		            state = RELATIVE_SLASH;
		          } else if (chr === '?') {
		            url.username = base.username;
		            url.password = base.password;
		            url.host = base.host;
		            url.port = base.port;
		            url.path = arraySlice(base.path);
		            url.query = '';
		            state = QUERY;
		          } else if (chr === '#') {
		            url.username = base.username;
		            url.password = base.password;
		            url.host = base.host;
		            url.port = base.port;
		            url.path = arraySlice(base.path);
		            url.query = base.query;
		            url.fragment = '';
		            state = FRAGMENT;
		          } else {
		            url.username = base.username;
		            url.password = base.password;
		            url.host = base.host;
		            url.port = base.port;
		            url.path = arraySlice(base.path);
		            url.path.length--;
		            state = PATH;
		            continue;
		          } break;

		        case RELATIVE_SLASH:
		          if (url.isSpecial() && (chr === '/' || chr === '\\')) {
		            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
		          } else if (chr === '/') {
		            state = AUTHORITY;
		          } else {
		            url.username = base.username;
		            url.password = base.password;
		            url.host = base.host;
		            url.port = base.port;
		            state = PATH;
		            continue;
		          } break;

		        case SPECIAL_AUTHORITY_SLASHES:
		          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
		          if (chr !== '/' || charAt(buffer, pointer + 1) !== '/') continue;
		          pointer++;
		          break;

		        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
		          if (chr !== '/' && chr !== '\\') {
		            state = AUTHORITY;
		            continue;
		          } break;

		        case AUTHORITY:
		          if (chr === '@') {
		            if (seenAt) buffer = '%40' + buffer;
		            seenAt = true;
		            bufferCodePoints = arrayFrom(buffer);
		            for (var i = 0; i < bufferCodePoints.length; i++) {
		              var codePoint = bufferCodePoints[i];
		              if (codePoint === ':' && !seenPasswordToken) {
		                seenPasswordToken = true;
		                continue;
		              }
		              var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
		              if (seenPasswordToken) url.password += encodedCodePoints;
		              else url.username += encodedCodePoints;
		            }
		            buffer = '';
		          } else if (
		            chr === EOF || chr === '/' || chr === '?' || chr === '#' ||
		            (chr === '\\' && url.isSpecial())
		          ) {
		            if (seenAt && buffer === '') return INVALID_AUTHORITY;
		            pointer -= arrayFrom(buffer).length + 1;
		            buffer = '';
		            state = HOST;
		          } else buffer += chr;
		          break;

		        case HOST:
		        case HOSTNAME:
		          if (stateOverride && url.scheme === 'file') {
		            state = FILE_HOST;
		            continue;
		          } else if (chr === ':' && !seenBracket) {
		            if (buffer === '') return INVALID_HOST;
		            failure = url.parseHost(buffer);
		            if (failure) return failure;
		            buffer = '';
		            state = PORT;
		            if (stateOverride === HOSTNAME) return;
		          } else if (
		            chr === EOF || chr === '/' || chr === '?' || chr === '#' ||
		            (chr === '\\' && url.isSpecial())
		          ) {
		            if (url.isSpecial() && buffer === '') return INVALID_HOST;
		            if (stateOverride && buffer === '' && (url.includesCredentials() || url.port !== null)) return;
		            failure = url.parseHost(buffer);
		            if (failure) return failure;
		            buffer = '';
		            state = PATH_START;
		            if (stateOverride) return;
		            continue;
		          } else {
		            if (chr === '[') seenBracket = true;
		            else if (chr === ']') seenBracket = false;
		            buffer += chr;
		          } break;

		        case PORT:
		          if (exec(DIGIT, chr)) {
		            buffer += chr;
		          } else if (
		            chr === EOF || chr === '/' || chr === '?' || chr === '#' ||
		            (chr === '\\' && url.isSpecial()) ||
		            stateOverride
		          ) {
		            if (buffer !== '') {
		              var port = parseInt(buffer, 10);
		              if (port > 0xFFFF) return INVALID_PORT;
		              url.port = (url.isSpecial() && port === specialSchemes[url.scheme]) ? null : port;
		              buffer = '';
		            }
		            if (stateOverride) return;
		            state = PATH_START;
		            continue;
		          } else return INVALID_PORT;
		          break;

		        case FILE:
		          url.scheme = 'file';
		          if (chr === '/' || chr === '\\') state = FILE_SLASH;
		          else if (base && base.scheme === 'file') {
		            switch (chr) {
		              case EOF:
		                url.host = base.host;
		                url.path = arraySlice(base.path);
		                url.query = base.query;
		                break;
		              case '?':
		                url.host = base.host;
		                url.path = arraySlice(base.path);
		                url.query = '';
		                state = QUERY;
		                break;
		              case '#':
		                url.host = base.host;
		                url.path = arraySlice(base.path);
		                url.query = base.query;
		                url.fragment = '';
		                state = FRAGMENT;
		                break;
		              default:
		                if (!startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
		                  url.host = base.host;
		                  url.path = arraySlice(base.path);
		                  url.shortenPath();
		                }
		                state = PATH;
		                continue;
		            }
		          } else {
		            state = PATH;
		            continue;
		          } break;

		        case FILE_SLASH:
		          if (chr === '/' || chr === '\\') {
		            state = FILE_HOST;
		            break;
		          }
		          if (base && base.scheme === 'file' && !startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
		            if (isWindowsDriveLetter(base.path[0], true)) push(url.path, base.path[0]);
		            else url.host = base.host;
		          }
		          state = PATH;
		          continue;

		        case FILE_HOST:
		          if (chr === EOF || chr === '/' || chr === '\\' || chr === '?' || chr === '#') {
		            if (!stateOverride && isWindowsDriveLetter(buffer)) {
		              state = PATH;
		            } else if (buffer === '') {
		              url.host = '';
		              if (stateOverride) return;
		              state = PATH_START;
		            } else {
		              failure = url.parseHost(buffer);
		              if (failure) return failure;
		              if (url.host === 'localhost') url.host = '';
		              if (stateOverride) return;
		              buffer = '';
		              state = PATH_START;
		            } continue;
		          } else buffer += chr;
		          break;

		        case PATH_START:
		          if (url.isSpecial()) {
		            state = PATH;
		            if (chr !== '/' && chr !== '\\') continue;
		          } else if (!stateOverride && chr === '?') {
		            url.query = '';
		            state = QUERY;
		          } else if (!stateOverride && chr === '#') {
		            url.fragment = '';
		            state = FRAGMENT;
		          } else if (chr !== EOF) {
		            state = PATH;
		            if (chr !== '/') continue;
		          } break;

		        case PATH:
		          if (
		            chr === EOF || chr === '/' ||
		            (chr === '\\' && url.isSpecial()) ||
		            (!stateOverride && (chr === '?' || chr === '#'))
		          ) {
		            if (isDoubleDot(buffer)) {
		              url.shortenPath();
		              if (chr !== '/' && !(chr === '\\' && url.isSpecial())) {
		                push(url.path, '');
		              }
		            } else if (isSingleDot(buffer)) {
		              if (chr !== '/' && !(chr === '\\' && url.isSpecial())) {
		                push(url.path, '');
		              }
		            } else {
		              if (url.scheme === 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
		                if (url.host) url.host = '';
		                buffer = charAt(buffer, 0) + ':'; // normalize windows drive letter
		              }
		              push(url.path, buffer);
		            }
		            buffer = '';
		            if (url.scheme === 'file' && (chr === EOF || chr === '?' || chr === '#')) {
		              while (url.path.length > 1 && url.path[0] === '') {
		                shift(url.path);
		              }
		            }
		            if (chr === '?') {
		              url.query = '';
		              state = QUERY;
		            } else if (chr === '#') {
		              url.fragment = '';
		              state = FRAGMENT;
		            }
		          } else {
		            buffer += percentEncode(chr, pathPercentEncodeSet);
		          } break;

		        case CANNOT_BE_A_BASE_URL_PATH:
		          if (chr === '?') {
		            url.query = '';
		            state = QUERY;
		          } else if (chr === '#') {
		            url.fragment = '';
		            state = FRAGMENT;
		          } else if (chr !== EOF) {
		            url.path[0] += percentEncode(chr, C0ControlPercentEncodeSet);
		          } break;

		        case QUERY:
		          if (!stateOverride && chr === '#') {
		            url.fragment = '';
		            state = FRAGMENT;
		          } else if (chr !== EOF) {
		            if (chr === "'" && url.isSpecial()) url.query += '%27';
		            else if (chr === '#') url.query += '%23';
		            else url.query += percentEncode(chr, C0ControlPercentEncodeSet);
		          } break;

		        case FRAGMENT:
		          if (chr !== EOF) url.fragment += percentEncode(chr, fragmentPercentEncodeSet);
		          break;
		      }

		      pointer++;
		    }
		  },
		  // https://url.spec.whatwg.org/#host-parsing
		  parseHost: function (input) {
		    var result, codePoints, index;
		    if (charAt(input, 0) === '[') {
		      if (charAt(input, input.length - 1) !== ']') return INVALID_HOST;
		      result = parseIPv6(stringSlice(input, 1, -1));
		      if (!result) return INVALID_HOST;
		      this.host = result;
		    // opaque host
		    } else if (!this.isSpecial()) {
		      if (exec(FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT, input)) return INVALID_HOST;
		      result = '';
		      codePoints = arrayFrom(input);
		      for (index = 0; index < codePoints.length; index++) {
		        result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
		      }
		      this.host = result;
		    } else {
		      input = toASCII(input);
		      if (exec(FORBIDDEN_HOST_CODE_POINT, input)) return INVALID_HOST;
		      result = parseIPv4(input);
		      if (result === null) return INVALID_HOST;
		      this.host = result;
		    }
		  },
		  // https://url.spec.whatwg.org/#cannot-have-a-username-password-port
		  cannotHaveUsernamePasswordPort: function () {
		    return !this.host || this.cannotBeABaseURL || this.scheme === 'file';
		  },
		  // https://url.spec.whatwg.org/#include-credentials
		  includesCredentials: function () {
		    return this.username !== '' || this.password !== '';
		  },
		  // https://url.spec.whatwg.org/#is-special
		  isSpecial: function () {
		    return hasOwn(specialSchemes, this.scheme);
		  },
		  // https://url.spec.whatwg.org/#shorten-a-urls-path
		  shortenPath: function () {
		    var path = this.path;
		    var pathSize = path.length;
		    if (pathSize && (this.scheme !== 'file' || pathSize !== 1 || !isWindowsDriveLetter(path[0], true))) {
		      path.length--;
		    }
		  },
		  // https://url.spec.whatwg.org/#concept-url-serializer
		  serialize: function () {
		    var url = this;
		    var scheme = url.scheme;
		    var username = url.username;
		    var password = url.password;
		    var host = url.host;
		    var port = url.port;
		    var path = url.path;
		    var query = url.query;
		    var fragment = url.fragment;
		    var output = scheme + ':';
		    if (host !== null) {
		      output += '//';
		      if (url.includesCredentials()) {
		        output += username + (password ? ':' + password : '') + '@';
		      }
		      output += serializeHost(host);
		      if (port !== null) output += ':' + port;
		    } else if (scheme === 'file') output += '//';
		    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
		    if (query !== null) output += '?' + query;
		    if (fragment !== null) output += '#' + fragment;
		    return output;
		  },
		  // https://url.spec.whatwg.org/#dom-url-href
		  setHref: function (href) {
		    var failure = this.parse(href);
		    if (failure) throw new TypeError(failure);
		    this.searchParams.update();
		  },
		  // https://url.spec.whatwg.org/#dom-url-origin
		  getOrigin: function () {
		    var scheme = this.scheme;
		    var port = this.port;
		    if (scheme === 'blob') try {
		      return new URLConstructor(scheme.path[0]).origin;
		    } catch (error) {
		      return 'null';
		    }
		    if (scheme === 'file' || !this.isSpecial()) return 'null';
		    return scheme + '://' + serializeHost(this.host) + (port !== null ? ':' + port : '');
		  },
		  // https://url.spec.whatwg.org/#dom-url-protocol
		  getProtocol: function () {
		    return this.scheme + ':';
		  },
		  setProtocol: function (protocol) {
		    this.parse($toString(protocol) + ':', SCHEME_START);
		  },
		  // https://url.spec.whatwg.org/#dom-url-username
		  getUsername: function () {
		    return this.username;
		  },
		  setUsername: function (username) {
		    var codePoints = arrayFrom($toString(username));
		    if (this.cannotHaveUsernamePasswordPort()) return;
		    this.username = '';
		    for (var i = 0; i < codePoints.length; i++) {
		      this.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
		    }
		  },
		  // https://url.spec.whatwg.org/#dom-url-password
		  getPassword: function () {
		    return this.password;
		  },
		  setPassword: function (password) {
		    var codePoints = arrayFrom($toString(password));
		    if (this.cannotHaveUsernamePasswordPort()) return;
		    this.password = '';
		    for (var i = 0; i < codePoints.length; i++) {
		      this.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
		    }
		  },
		  // https://url.spec.whatwg.org/#dom-url-host
		  getHost: function () {
		    var host = this.host;
		    var port = this.port;
		    return host === null ? ''
		      : port === null ? serializeHost(host)
		      : serializeHost(host) + ':' + port;
		  },
		  setHost: function (host) {
		    if (this.cannotBeABaseURL) return;
		    this.parse(host, HOST);
		  },
		  // https://url.spec.whatwg.org/#dom-url-hostname
		  getHostname: function () {
		    var host = this.host;
		    return host === null ? '' : serializeHost(host);
		  },
		  setHostname: function (hostname) {
		    if (this.cannotBeABaseURL) return;
		    this.parse(hostname, HOSTNAME);
		  },
		  // https://url.spec.whatwg.org/#dom-url-port
		  getPort: function () {
		    var port = this.port;
		    return port === null ? '' : $toString(port);
		  },
		  setPort: function (port) {
		    if (this.cannotHaveUsernamePasswordPort()) return;
		    port = $toString(port);
		    if (port === '') this.port = null;
		    else this.parse(port, PORT);
		  },
		  // https://url.spec.whatwg.org/#dom-url-pathname
		  getPathname: function () {
		    var path = this.path;
		    return this.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
		  },
		  setPathname: function (pathname) {
		    if (this.cannotBeABaseURL) return;
		    this.path = [];
		    this.parse(pathname, PATH_START);
		  },
		  // https://url.spec.whatwg.org/#dom-url-search
		  getSearch: function () {
		    var query = this.query;
		    return query ? '?' + query : '';
		  },
		  setSearch: function (search) {
		    search = $toString(search);
		    if (search === '') {
		      this.query = null;
		    } else {
		      if (charAt(search, 0) === '?') search = stringSlice(search, 1);
		      this.query = '';
		      this.parse(search, QUERY);
		    }
		    this.searchParams.update();
		  },
		  // https://url.spec.whatwg.org/#dom-url-searchparams
		  getSearchParams: function () {
		    return this.searchParams.facade;
		  },
		  // https://url.spec.whatwg.org/#dom-url-hash
		  getHash: function () {
		    var fragment = this.fragment;
		    return fragment ? '#' + fragment : '';
		  },
		  setHash: function (hash) {
		    hash = $toString(hash);
		    if (hash === '') {
		      this.fragment = null;
		      return;
		    }
		    if (charAt(hash, 0) === '#') hash = stringSlice(hash, 1);
		    this.fragment = '';
		    this.parse(hash, FRAGMENT);
		  },
		  update: function () {
		    this.query = this.searchParams.serialize() || null;
		  }
		};

		// `URL` constructor
		// https://url.spec.whatwg.org/#url-class
		var URLConstructor = function URL(url /* , base */) {
		  var that = anInstance(this, URLPrototype);
		  var base = validateArgumentsLength(arguments.length, 1) > 1 ? arguments[1] : undefined;
		  var state = setInternalState(that, new URLState(url, false, base));
		  if (!DESCRIPTORS) {
		    that.href = state.serialize();
		    that.origin = state.getOrigin();
		    that.protocol = state.getProtocol();
		    that.username = state.getUsername();
		    that.password = state.getPassword();
		    that.host = state.getHost();
		    that.hostname = state.getHostname();
		    that.port = state.getPort();
		    that.pathname = state.getPathname();
		    that.search = state.getSearch();
		    that.searchParams = state.getSearchParams();
		    that.hash = state.getHash();
		  }
		};

		var URLPrototype = URLConstructor.prototype;

		var accessorDescriptor = function (getter, setter) {
		  return {
		    get: function () {
		      return getInternalURLState(this)[getter]();
		    },
		    set: setter && function (value) {
		      return getInternalURLState(this)[setter](value);
		    },
		    configurable: true,
		    enumerable: true
		  };
		};

		if (DESCRIPTORS) {
		  // `URL.prototype.href` accessors pair
		  // https://url.spec.whatwg.org/#dom-url-href
		  defineBuiltInAccessor(URLPrototype, 'href', accessorDescriptor('serialize', 'setHref'));
		  // `URL.prototype.origin` getter
		  // https://url.spec.whatwg.org/#dom-url-origin
		  defineBuiltInAccessor(URLPrototype, 'origin', accessorDescriptor('getOrigin'));
		  // `URL.prototype.protocol` accessors pair
		  // https://url.spec.whatwg.org/#dom-url-protocol
		  defineBuiltInAccessor(URLPrototype, 'protocol', accessorDescriptor('getProtocol', 'setProtocol'));
		  // `URL.prototype.username` accessors pair
		  // https://url.spec.whatwg.org/#dom-url-username
		  defineBuiltInAccessor(URLPrototype, 'username', accessorDescriptor('getUsername', 'setUsername'));
		  // `URL.prototype.password` accessors pair
		  // https://url.spec.whatwg.org/#dom-url-password
		  defineBuiltInAccessor(URLPrototype, 'password', accessorDescriptor('getPassword', 'setPassword'));
		  // `URL.prototype.host` accessors pair
		  // https://url.spec.whatwg.org/#dom-url-host
		  defineBuiltInAccessor(URLPrototype, 'host', accessorDescriptor('getHost', 'setHost'));
		  // `URL.prototype.hostname` accessors pair
		  // https://url.spec.whatwg.org/#dom-url-hostname
		  defineBuiltInAccessor(URLPrototype, 'hostname', accessorDescriptor('getHostname', 'setHostname'));
		  // `URL.prototype.port` accessors pair
		  // https://url.spec.whatwg.org/#dom-url-port
		  defineBuiltInAccessor(URLPrototype, 'port', accessorDescriptor('getPort', 'setPort'));
		  // `URL.prototype.pathname` accessors pair
		  // https://url.spec.whatwg.org/#dom-url-pathname
		  defineBuiltInAccessor(URLPrototype, 'pathname', accessorDescriptor('getPathname', 'setPathname'));
		  // `URL.prototype.search` accessors pair
		  // https://url.spec.whatwg.org/#dom-url-search
		  defineBuiltInAccessor(URLPrototype, 'search', accessorDescriptor('getSearch', 'setSearch'));
		  // `URL.prototype.searchParams` getter
		  // https://url.spec.whatwg.org/#dom-url-searchparams
		  defineBuiltInAccessor(URLPrototype, 'searchParams', accessorDescriptor('getSearchParams'));
		  // `URL.prototype.hash` accessors pair
		  // https://url.spec.whatwg.org/#dom-url-hash
		  defineBuiltInAccessor(URLPrototype, 'hash', accessorDescriptor('getHash', 'setHash'));
		}

		// `URL.prototype.toJSON` method
		// https://url.spec.whatwg.org/#dom-url-tojson
		defineBuiltIn(URLPrototype, 'toJSON', function toJSON() {
		  return getInternalURLState(this).serialize();
		}, { enumerable: true });

		// `URL.prototype.toString` method
		// https://url.spec.whatwg.org/#URL-stringification-behavior
		defineBuiltIn(URLPrototype, 'toString', function toString() {
		  return getInternalURLState(this).serialize();
		}, { enumerable: true });

		if (NativeURL) {
		  var nativeCreateObjectURL = NativeURL.createObjectURL;
		  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
		  // `URL.createObjectURL` method
		  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
		  if (nativeCreateObjectURL) defineBuiltIn(URLConstructor, 'createObjectURL', bind(nativeCreateObjectURL, NativeURL));
		  // `URL.revokeObjectURL` method
		  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
		  if (nativeRevokeObjectURL) defineBuiltIn(URLConstructor, 'revokeObjectURL', bind(nativeRevokeObjectURL, NativeURL));
		}

		setToStringTag(URLConstructor, 'URL');

		$({ global: true, constructor: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
		  URL: URLConstructor
		});
		return web_url_constructor;
	}

	var hasRequiredWeb_url;

	function requireWeb_url () {
		if (hasRequiredWeb_url) return web_url;
		hasRequiredWeb_url = 1;
		// TODO: Remove this module from `core-js@4` since it's replaced to module below
		requireWeb_url_constructor();
		return web_url;
	}

	requireWeb_url();

	var web_url_toJson = {};

	var hasRequiredWeb_url_toJson;

	function requireWeb_url_toJson () {
		if (hasRequiredWeb_url_toJson) return web_url_toJson;
		hasRequiredWeb_url_toJson = 1;
		var $ = require_export();
		var call = requireFunctionCall();

		// `URL.prototype.toJSON` method
		// https://url.spec.whatwg.org/#dom-url-tojson
		$({ target: 'URL', proto: true, enumerable: true }, {
		  toJSON: function toJSON() {
		    return call(URL.prototype.toString, this);
		  }
		});
		return web_url_toJson;
	}

	requireWeb_url_toJson();

	var web_urlSearchParams = {};

	var hasRequiredWeb_urlSearchParams;

	function requireWeb_urlSearchParams () {
		if (hasRequiredWeb_urlSearchParams) return web_urlSearchParams;
		hasRequiredWeb_urlSearchParams = 1;
		// TODO: Remove this module from `core-js@4` since it's replaced to module below
		requireWeb_urlSearchParams_constructor();
		return web_urlSearchParams;
	}

	requireWeb_urlSearchParams();

	var web_urlSearchParams_delete = {};

	var hasRequiredWeb_urlSearchParams_delete;

	function requireWeb_urlSearchParams_delete () {
		if (hasRequiredWeb_urlSearchParams_delete) return web_urlSearchParams_delete;
		hasRequiredWeb_urlSearchParams_delete = 1;
		var defineBuiltIn = requireDefineBuiltIn();
		var uncurryThis = requireFunctionUncurryThis();
		var toString = requireToString();
		var validateArgumentsLength = requireValidateArgumentsLength();

		var $URLSearchParams = URLSearchParams;
		var URLSearchParamsPrototype = $URLSearchParams.prototype;
		var append = uncurryThis(URLSearchParamsPrototype.append);
		var $delete = uncurryThis(URLSearchParamsPrototype['delete']);
		var forEach = uncurryThis(URLSearchParamsPrototype.forEach);
		var push = uncurryThis([].push);
		var params = new $URLSearchParams('a=1&a=2&b=3');

		params['delete']('a', 1);
		// `undefined` case is a Chromium 117 bug
		// https://bugs.chromium.org/p/v8/issues/detail?id=14222
		params['delete']('b', undefined);

		if (params + '' !== 'a=2') {
		  defineBuiltIn(URLSearchParamsPrototype, 'delete', function (name /* , value */) {
		    var length = arguments.length;
		    var $value = length < 2 ? undefined : arguments[1];
		    if (length && $value === undefined) return $delete(this, name);
		    var entries = [];
		    forEach(this, function (v, k) { // also validates `this`
		      push(entries, { key: k, value: v });
		    });
		    validateArgumentsLength(length, 1);
		    var key = toString(name);
		    var value = toString($value);
		    var index = 0;
		    var dindex = 0;
		    var found = false;
		    var entriesLength = entries.length;
		    var entry;
		    while (index < entriesLength) {
		      entry = entries[index++];
		      if (found || entry.key === key) {
		        found = true;
		        $delete(this, entry.key);
		      } else dindex++;
		    }
		    while (dindex < entriesLength) {
		      entry = entries[dindex++];
		      if (!(entry.key === key && entry.value === value)) append(this, entry.key, entry.value);
		    }
		  }, { enumerable: true, unsafe: true });
		}
		return web_urlSearchParams_delete;
	}

	requireWeb_urlSearchParams_delete();

	var web_urlSearchParams_has = {};

	var hasRequiredWeb_urlSearchParams_has;

	function requireWeb_urlSearchParams_has () {
		if (hasRequiredWeb_urlSearchParams_has) return web_urlSearchParams_has;
		hasRequiredWeb_urlSearchParams_has = 1;
		var defineBuiltIn = requireDefineBuiltIn();
		var uncurryThis = requireFunctionUncurryThis();
		var toString = requireToString();
		var validateArgumentsLength = requireValidateArgumentsLength();

		var $URLSearchParams = URLSearchParams;
		var URLSearchParamsPrototype = $URLSearchParams.prototype;
		var getAll = uncurryThis(URLSearchParamsPrototype.getAll);
		var $has = uncurryThis(URLSearchParamsPrototype.has);
		var params = new $URLSearchParams('a=1');

		// `undefined` case is a Chromium 117 bug
		// https://bugs.chromium.org/p/v8/issues/detail?id=14222
		if (params.has('a', 2) || !params.has('a', undefined)) {
		  defineBuiltIn(URLSearchParamsPrototype, 'has', function has(name /* , value */) {
		    var length = arguments.length;
		    var $value = length < 2 ? undefined : arguments[1];
		    if (length && $value === undefined) return $has(this, name);
		    var values = getAll(this, name); // also validates `this`
		    validateArgumentsLength(length, 1);
		    var value = toString($value);
		    var index = 0;
		    while (index < values.length) {
		      if (values[index++] === value) return true;
		    } return false;
		  }, { enumerable: true, unsafe: true });
		}
		return web_urlSearchParams_has;
	}

	requireWeb_urlSearchParams_has();

	var web_urlSearchParams_size = {};

	var hasRequiredWeb_urlSearchParams_size;

	function requireWeb_urlSearchParams_size () {
		if (hasRequiredWeb_urlSearchParams_size) return web_urlSearchParams_size;
		hasRequiredWeb_urlSearchParams_size = 1;
		var DESCRIPTORS = requireDescriptors();
		var uncurryThis = requireFunctionUncurryThis();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();

		var URLSearchParamsPrototype = URLSearchParams.prototype;
		var forEach = uncurryThis(URLSearchParamsPrototype.forEach);

		// `URLSearchParams.prototype.size` getter
		// https://github.com/whatwg/url/pull/734
		if (DESCRIPTORS && !('size' in URLSearchParamsPrototype)) {
		  defineBuiltInAccessor(URLSearchParamsPrototype, 'size', {
		    get: function size() {
		      var count = 0;
		      forEach(this, function () { count++; });
		      return count;
		    },
		    configurable: true,
		    enumerable: true
		  });
		}
		return web_urlSearchParams_size;
	}

	requireWeb_urlSearchParams_size();

	var s_min = {};

	/*!
	 * SJS 6.15.1
	 */

	var hasRequiredS_min;

	function requireS_min () {
		if (hasRequiredS_min) return s_min;
		hasRequiredS_min = 1;
		!function(){function e(e,t){return (t||"")+" (SystemJS https://github.com/systemjs/systemjs/blob/main/docs/errors.md#"+e+")"}function t(e,t){if(-1!==e.indexOf("\\")&&(e=e.replace(S,"/")),"/"===e[0]&&"/"===e[1])return t.slice(0,t.indexOf(":")+1)+e;if("."===e[0]&&("/"===e[1]||"."===e[1]&&("/"===e[2]||2===e.length&&(e+="/"))||1===e.length&&(e+="/"))||"/"===e[0]){var r,n=t.slice(0,t.indexOf(":")+1);if(r="/"===t[n.length+1]?"file:"!==n?(r=t.slice(n.length+2)).slice(r.indexOf("/")+1):t.slice(8):t.slice(n.length+("/"===t[n.length])),"/"===e[0])return t.slice(0,t.length-r.length-1)+e;for(var i=r.slice(0,r.lastIndexOf("/")+1)+e,o=[],s=-1,c=0;c<i.length;c++)-1!==s?"/"===i[c]&&(o.push(i.slice(s,c+1)),s=-1):"."===i[c]?"."!==i[c+1]||"/"!==i[c+2]&&c+2!==i.length?"/"===i[c+1]||c+1===i.length?c+=1:s=c:(o.pop(),c+=2):s=c;return -1!==s&&o.push(i.slice(s)),t.slice(0,t.length-r.length)+o.join("")}}function r(e,r){return t(e,r)||(-1!==e.indexOf(":")?e:t("./"+e,r))}function n(e,r,n,i,o){for(var s in e){var f=t(s,n)||s,a=e[s];if("string"==typeof a){var l=u(i,t(a,n)||a,o);l?r[f]=l:c("W1",s,a);}}}function i(e,t,i){var o;for(o in e.imports&&n(e.imports,i.imports,t,i,null),e.scopes||{}){var s=r(o,t);n(e.scopes[o],i.scopes[s]||(i.scopes[s]={}),t,i,s);}for(o in e.depcache||{})i.depcache[r(o,t)]=e.depcache[o];for(o in e.integrity||{})i.integrity[r(o,t)]=e.integrity[o];}function o(e,t){if(t[e])return e;var r=e.length;do{var n=e.slice(0,r+1);if(n in t)return n}while(-1!==(r=e.lastIndexOf("/",r-1)))}function s(e,t){var r=o(e,t);if(r){var n=t[r];if(null===n)return;if(!(e.length>r.length&&"/"!==n[n.length-1]))return n+e.slice(r.length);c("W2",r,n);}}function c(t,r,n){console.warn(e(t,[n,r].join(", ")));}function u(e,t,r){for(var n=e.scopes,i=r&&o(r,n);i;){var c=s(t,n[i]);if(c)return c;i=o(i.slice(0,i.lastIndexOf("/")),n);}return s(t,e.imports)||-1!==t.indexOf(":")&&t}function f(){this[b]={};}function a(t,r,n,i){var o=t[b][r];if(o)return o;var s=[],c=Object.create(null);j&&Object.defineProperty(c,j,{value:"Module"});var u=Promise.resolve().then((function(){return t.instantiate(r,n,i)})).then((function(n){if(!n)throw Error(e(2,r));var i=n[1]((function(e,t){o.h=!0;var r=!1;if("string"==typeof e)e in c&&c[e]===t||(c[e]=t,r=!0);else {for(var n in e)t=e[n],n in c&&c[n]===t||(c[n]=t,r=!0);e&&e.__esModule&&(c.__esModule=e.__esModule);}if(r)for(var i=0;i<s.length;i++){var u=s[i];u&&u(c);}return t}),2===n[1].length?{import:function(e,n){return t.import(e,r,n)},meta:t.createContext(r)}:void 0);return o.e=i.execute||function(){},[n[0],i.setters||[],n[2]||[]]}),(function(e){throw o.e=null,o.er=e,e})),f=u.then((function(e){return Promise.all(e[0].map((function(n,i){var o=e[1][i],s=e[2][i];return Promise.resolve(t.resolve(n,r)).then((function(e){var n=a(t,e,r,s);return Promise.resolve(n.I).then((function(){return o&&(n.i.push(o),!n.h&&n.I||o(n.n)),n}))}))}))).then((function(e){o.d=e;}))}));return o=t[b][r]={id:r,i:s,n:c,m:i,I:u,L:f,h:!1,d:void 0,e:void 0,er:void 0,E:void 0,C:void 0,p:void 0}}function l(e,t,r,n){if(!n[t.id])return n[t.id]=!0,Promise.resolve(t.L).then((function(){return t.p&&null!==t.p.e||(t.p=r),Promise.all(t.d.map((function(t){return l(e,t,r,n)})))})).catch((function(e){if(t.er)throw e;throw t.e=null,e}))}function h(e,t){return t.C=l(e,t,t,{}).then((function(){return d(e,t,{})})).then((function(){return t.n}))}function d(e,t,r){function n(){try{var e=o.call(I);if(e)return e=e.then((function(){t.C=t.n,t.E=null;}),(function(e){throw t.er=e,t.E=null,e})),t.E=e;t.C=t.n,t.L=t.I=void 0;}catch(r){throw t.er=r,r}}if(!r[t.id]){if(r[t.id]=!0,!t.e){if(t.er)throw t.er;return t.E?t.E:void 0}var i,o=t.e;return t.e=null,t.d.forEach((function(n){try{var o=d(e,n,r);o&&(i=i||[]).push(o);}catch(s){throw t.er=s,s}})),i?Promise.all(i).then(n):n()}}function v(){[].forEach.call(document.querySelectorAll("script"),(function(t){if(!t.sp)if("systemjs-module"===t.type){if(t.sp=!0,!t.src)return;System.import("import:"===t.src.slice(0,7)?t.src.slice(7):r(t.src,p)).catch((function(e){if(e.message.indexOf("https://github.com/systemjs/systemjs/blob/main/docs/errors.md#3")>-1){var r=document.createEvent("Event");r.initEvent("error",!1,!1),t.dispatchEvent(r);}return Promise.reject(e)}));}else if("systemjs-importmap"===t.type){t.sp=!0;var n=t.src?(System.fetch||fetch)(t.src,{integrity:t.integrity,priority:t.fetchPriority,passThrough:!0}).then((function(e){if(!e.ok)throw Error(e.status);return e.text()})).catch((function(r){return r.message=e("W4",t.src)+"\n"+r.message,console.warn(r),"function"==typeof t.onerror&&t.onerror(),"{}"})):t.innerHTML;M=M.then((function(){return n})).then((function(r){!function(t,r,n){var o={};try{o=JSON.parse(r);}catch(s){console.warn(Error(e("W5")));}i(o,n,t);}(R,r,t.src||p);}));}}));}var p,m="undefined"!=typeof Symbol,g="undefined"!=typeof self,y="undefined"!=typeof document,E=g?self:commonjsGlobal;if(y){var w=document.querySelector("base[href]");w&&(p=w.href);}if(!p&&"undefined"!=typeof location){var O=(p=location.href.split("#")[0].split("?")[0]).lastIndexOf("/");-1!==O&&(p=p.slice(0,O+1));}var x,S=/\\/g,j=m&&Symbol.toStringTag,b=m?Symbol():"@",P=f.prototype;P.import=function(e,t,r){var n=this;return t&&"object"==typeof t&&(r=t,t=void 0),Promise.resolve(n.prepareImport()).then((function(){return n.resolve(e,t,r)})).then((function(e){var t=a(n,e,void 0,r);return t.C||h(n,t)}))},P.createContext=function(e){var t=this;return {url:e,resolve:function(r,n){return Promise.resolve(t.resolve(r,n||e))}}},P.register=function(e,t,r){x=[e,t,r];},P.getRegister=function(){var e=x;return x=void 0,e};var I=Object.freeze(Object.create(null));E.System=new f;var L,C,M=Promise.resolve(),R={imports:{},scopes:{},depcache:{},integrity:{}},T=y;if(P.prepareImport=function(e){return (T||e)&&(v(),T=!1),M},P.getImportMap=function(){return JSON.parse(JSON.stringify(R))},y&&(v(),window.addEventListener("DOMContentLoaded",v)),P.addImportMap=function(e,t){i(e,t||p,R);},y){window.addEventListener("error",(function(e){J=e.filename,W=e.error;}));var _=location.origin;}P.createScript=function(e){var t=document.createElement("script");t.async=!0,e.indexOf(_+"/")&&(t.crossOrigin="anonymous");var r=R.integrity[e];return r&&(t.integrity=r),t.src=e,t};var J,W,q={},N=P.register;P.register=function(e,t){if(y&&"loading"===document.readyState&&"string"!=typeof e){var r=document.querySelectorAll("script[src]"),n=r[r.length-1];if(n){L=e;var i=this;C=setTimeout((function(){q[n.src]=[e,t],i.import(n.src);}));}}else L=void 0;return N.call(this,e,t)},P.instantiate=function(t,r){var n=q[t];if(n)return delete q[t],n;var i=this;return Promise.resolve(P.createScript(t)).then((function(n){return new Promise((function(o,s){n.addEventListener("error",(function(){s(Error(e(3,[t,r].join(", "))));})),n.addEventListener("load",(function(){if(document.head.removeChild(n),J===t)s(W);else {var e=i.getRegister(t);e&&e[0]===L&&clearTimeout(C),o(e);}})),document.head.appendChild(n);}))}))},P.shouldFetch=function(){return !1},"undefined"!=typeof fetch&&(P.fetch=fetch);var k=P.instantiate,A=/^(text|application)\/(x-)?javascript(;|$)/;P.instantiate=function(t,r,n){var i=this;return this.shouldFetch(t,r,n)?this.fetch(t,{credentials:"same-origin",integrity:R.integrity[t],meta:n}).then((function(n){if(!n.ok)throw Error(e(7,[n.status,n.statusText,t,r].join(", ")));var o=n.headers.get("content-type");if(!o||!A.test(o))throw Error(e(4,o));return n.text().then((function(e){return e.indexOf("//# sourceURL=")<0&&(e+="\n//# sourceURL="+t),(0, eval)(e),i.getRegister(t)}))})):k.apply(this,arguments)},P.resolve=function(r,n){return u(R,t(r,n=n||p)||r,n)||function(t,r){throw Error(e(8,[t,r].join(", ")))}(r,n)};var F=P.instantiate;P.instantiate=function(e,t,r){var n=R.depcache[e];if(n)for(var i=0;i<n.length;i++)a(this,this.resolve(n[i],e),e);return F.call(this,e,t,r)},g&&"function"==typeof importScripts&&(P.instantiate=function(e){var t=this;return Promise.resolve().then((function(){return importScripts(e),t.getRegister(e)}))});}();
		
		return s_min;
	}

	requireS_min();

})();
