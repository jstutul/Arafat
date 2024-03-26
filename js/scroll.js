$(document).ready(function () {
    var toc = $(".toc");
    var tocPath = $(".toc-marker path");
    var tocItems;
    var TOP_MARGIN = 0.1,
        BOTTOM_MARGIN = 0.2;

    var pathLength;

    var lastPathStart, lastPathEnd;

    $(window).on("resize", drawPath);
    $(window).on("scroll", sync);

    drawPath();

    function drawPath() {
        tocItems = $(".toc li");

        tocItems = tocItems.map(function (index, item) {
            var anchor = $(item).find("a");
            var target = $("#" + anchor.attr("href").slice(1));

            return {
                listItem: item,
                anchor: anchor,
                target: target,
            };
        });

        tocItems = tocItems.filter(function (index, item) {
            return !!item.target.length;
        });

        var path = [];
        var pathIndent;

        tocItems.each(function (i, item) {
            var x = item.anchor.position().left - 5,
                y = item.anchor.position().top,
                height = item.anchor.outerHeight();

            if (i === 0) {
                path.push("M", x, y, "L", x, y + height);
                item.pathStart = 0;
            } else {
                if (pathIndent !== x) path.push("L", pathIndent, y);

                path.push("L", x, y);

                tocPath.attr("d", path.join(" "));
                item.pathStart = tocPath[0].getTotalLength() || 0;

                path.push("L", x, y + height);
            }

            pathIndent = x;

            tocPath.attr("d", path.join(" "));
            item.pathEnd = tocPath[0].getTotalLength();
        });

        pathLength = tocPath[0].getTotalLength();

        sync();
    }

    function sync() {
        var windowHeight = $(window).height();
        var pathStart = pathLength,
            pathEnd = 0;

        var visibleItems = 0;

        tocItems.each(function (index, item) {
            var targetBounds = item.target[0].getBoundingClientRect();

            if (
                targetBounds.bottom > windowHeight * TOP_MARGIN &&
                targetBounds.top < windowHeight * (1 - BOTTOM_MARGIN)
            ) {
                pathStart = Math.min(item.pathStart, pathStart);
                pathEnd = Math.max(item.pathEnd, pathEnd);

                visibleItems += 1;

                $(item.listItem).addClass("visible");
            } else {
                $(item.listItem).removeClass("visible");
            }
        });

        if (visibleItems > 0 && pathStart < pathEnd) {
            if (pathStart !== lastPathStart || pathEnd !== lastPathEnd) {
                tocPath.attr("stroke-dashoffset", "1");
                tocPath.attr(
                    "stroke-dasharray",
                    "1, " +
                        pathStart +
                        ", " +
                        (pathEnd - pathStart) +
                        ", " +
                        pathLength
                );
                tocPath.attr("opacity", 1);
            }
        } else {
            tocPath.attr("opacity", 0);
        }

        lastPathStart = pathStart;
        lastPathEnd = pathEnd;
    }

    // Add click event to menu items to scroll to target div
});
$(document).ready(function () {
    var tocItems = $(".toc a");
    var headerHeight = $("header").outerHeight() || 0;
    tocItems.on("click", function (e) {
        e.preventDefault();
        var targetId = $(this).attr("href");
        var target = $(targetId);
        if (target.length) {
            var targetTop = target.offset().top - headerHeight;
            $("html, body").animate(
                {
                    scrollTop: targetTop,
                },
                50
            );
        }
    });
});
