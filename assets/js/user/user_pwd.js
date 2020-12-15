$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        //校验规则 vlaue的值是你把samePwd给那个文本框得到的就是哪个值
        samePwd: function (value) {
            if (value === $('.layui-form [name=oldPwd]').val()) {
                return '新密码与旧密码不能相同';
            }
        },

        rePwd: function (value) {
            if (value !== $('.layui-form [name=newPwd]').val()) {
                return '新密码与确认密码要保持相同';
            }
        }
    })

    //监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        //阻止表单默认行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                return layer.msg(res.message);

                //重置表单
                $('.layui-form')[0].reset();
            }
        });
    });
})