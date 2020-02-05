#include <stdio.h>
#include <quickjs-libc.h>
#include <uv.h>

// 重要函数，从这里开始，动态运行 js
static int eval_buf(JSContext *ctx, const void *buf, int buf_len,
                    const char *filename, int eval_flags) {
    JSValue val;
    int ret;

    if ((eval_flags & JS_EVAL_TYPE_MASK) == JS_EVAL_TYPE_MODULE) {
        val = JS_Eval(ctx, buf, buf_len, filename,
                        eval_flags | JS_EVAL_FLAG_COMPILE_ONLY);
        if (!JS_IsException(val)) {
            js_module_set_import_meta(ctx, val, TRUE, TRUE);
            val = JS_EvalFunction(ctx, val);
        }
    } else {
        // filename
        val = JS_Eval(ctx, buf, buf_len, filename, eval_flags);
    }
    if (JS_IsException(val)) {
        js_std_dump_error(ctx);
        ret = -1;
    } else {
        ret = 0;
    }
    JS_FreeValue(ctx, val);
    return ret;
}

typedef struct qjs_engine {
    JSContext *ctx;
    JSRuntime *rt;
} qjs_engine;

static void check_callback(uv_check_t *handle) {
    qjs_engine *engine = handle->data;
    JSContext *ctx = engine->ctx;

    JSContext *ctx1;
    int err;

    for (;;) {
        err = JS_ExecutePendingJob(JS_GetRuntime(ctx), &ctx1);
        if (err <= 0) {
            if (err < 0) {
                js_std_dump_error(ctx1);
            }
            break;
        }
    }
}

int main(int argc, char **argv) {
    JSRuntime *rt;
    JSContext *ctx;
    rt = JS_NewRuntime();
    ctx = JS_NewContextRaw(rt);

    // 往全局上下文注入 js 功能
    JS_SetModuleLoaderFunc(rt, NULL, js_module_loader, NULL);
    JS_AddIntrinsicBaseObjects(ctx);
    JS_AddIntrinsicDate(ctx);
    JS_AddIntrinsicEval(ctx);
    JS_AddIntrinsicStringNormalize(ctx);
    JS_AddIntrinsicRegExp(ctx);
    JS_AddIntrinsicJSON(ctx);
    JS_AddIntrinsicProxy(ctx);
    JS_AddIntrinsicMapSet(ctx);
    JS_AddIntrinsicTypedArrays(ctx);
    JS_AddIntrinsicPromise(ctx);
    JS_AddIntrinsicBigInt(ctx);
    
    js_std_add_helpers(ctx, argc, argv);

    uv_loop_t *loop = calloc(1, sizeof(*loop));
    uv_loop_init(loop);
    JS_SetContextOpaque(ctx, loop);

    uv_check_t *check = calloc(1, sizeof(*check));

    qjs_engine *engine = calloc(1, sizeof(*engine));
    engine->ctx = ctx;
    engine->rt = rt;
    uv_check_init(loop, check);
    check->data = engine;

    {
        extern JSModuleDef *js_init_module_uv(JSContext *ctx, const char *name);
        js_init_module_uv(ctx, "uv");
    }

    uint8_t *buf;
    size_t buf_len;
    // runtime 准备好以后，开始读入 入口 js 文件
    // 入口 js 文件，动态吃掉一个 js 文件，然后运行
    const char *filename = "./index.js";
    buf = js_load_file(ctx, &buf_len, filename);

    uv_check_start(check, check_callback);
    uv_unref((uv_handle_t *) check);

    // 运行 入口 js 文件内容
    eval_buf(ctx, buf, buf_len, filename, JS_EVAL_TYPE_MODULE);

    // 通过 libuv 实现事件循环，开始运行事件队列里面的代码
    uv_run(loop, UV_RUN_DEFAULT);
    
    JS_FreeContext(ctx);
    JS_FreeRuntime(rt);
    return 0;
}
