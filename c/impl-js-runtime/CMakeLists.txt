cmake_minimum_required(VERSION 3.10)
# 约定 runtime 为最终生成的可执行文件
project(runtime)
add_executable(runtime
        # 若拆分了多个 C 文件，逐行在此添加即可
        main.c
        timer.c
        )

# 导入 QuickJS 的头文件和库文件
include_directories(../quickjs)
add_library(quickjs STATIC IMPORTED)
## 导入静态链接库
set_target_properties(quickjs
        PROPERTIES IMPORTED_LOCATION
        "${CMAKE_CURRENT_LIST_DIR}/../quickjs/libquickjs.a")

# libuv
## 自己复制过去的头文件
include_directories(../libuv/heads)
add_library(libuv STATIC IMPORTED)
## 导入静态链接库
set_target_properties(
    libuv
    PROPERTIES IMPORTED_LOCATION
    "${CMAKE_CURRENT_LIST_DIR}/../libuv/out/cmake/libuv_a.a"
)

# 将 QuickJS 链接到 runtime
target_link_libraries(runtime
        libuv
        quickjs)