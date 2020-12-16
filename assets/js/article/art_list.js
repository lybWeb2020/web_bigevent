$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
        // return n < 10 ? '0' + n : n;
    }

    //定义一个查询的参数对象，将来请求数据的时候
    //需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的Id
        state: ''    //文章的发布状态
    }

    initTable()

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    initCate();
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败!');
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    }

    //为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        //阻止表单默认行为
        e.preventDefault();
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        console.log(cate_id + '+' + state);
        //为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //根据最新的筛选条件，重新渲染表格的数据
        initTable();
    });

    //定义渲染分页的方法
    function renderPage(total) {
        //调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',  //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum,  //设置默认被选中的分页
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页发生切换的时候，触发jump回调
            jump: function (obj, first) {
                //把最新的页码，赋值到q这个查询参数对象中
                // console.log(obj.curr);
                q.pagenum = obj.curr;
                //把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit;
                //根据最新的q获取对象的数据列表，进行渲染
                // initTable();
                if (!first) {
                    initTable();
                }
            }
        });
    }

    //通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        var len = $('.btn-delete').length;
        // console.log(len);
        var id = $(this).attr('data-index');
        console.log(id);
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章列表失败');
                    }
                    layer.msg('删除文章列表成功');
                    //关闭弹窗
                    layer.close(index);
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })

        })
    });

    //通过代理的形式，为编辑按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-edit', function (e) {
        
        e.preventDefault();
        var id = $(this).attr('data-index');
        console.log(id);
        //发起请求获取对象分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！')
                }
                console.log(res);
                layer.msg('获取文章分类数据成功！')
                // 调用 form.val() 快速为表单赋值
                // location.href = '../article/art_pub.html';
                window.location.replace('../article/art_pub.html');
            }
        })
        

    });
    
});