// Initialize charts when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Reports Chart
    const reportsChart = new ApexCharts(document.querySelector("#reportsChart"), {
        series: [{
            name: 'Doanh thu',
            data: [31, 40, 28, 51, 42, 82, 56],
        }, {
            name: 'Đơn hàng',
            data: [11, 32, 45, 32, 34, 52, 41]
        }],
        chart: {
            height: 350,
            type: 'area',
            toolbar: {
                show: false
            },
        },
        colors: ['#2eca6a', '#4154f1'],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'datetime',
            categories: ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-06", "2024-01-07"]
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        },
    });
    reportsChart.render();

    // Pie Chart
    const pieChart = new ApexCharts(document.querySelector("#pieChart"), {
        series: [44, 55, 13, 43],
        chart: {
            height: 350,
            type: 'pie',
        },
        labels: ['Đã giao', 'Đang giao', 'Chờ xác nhận', 'Đã hủy'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    });
    pieChart.render();

    // Bar Chart
    const barChart = new ApexCharts(document.querySelector("#barChart"), {
        series: [{
            data: [400, 430, 448, 470, 540, 580, 690]
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
                columnWidth: '57%'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Văn học', 'Kinh tế', 'Kỹ năng', 'Thiếu nhi', 'Giáo khoa', 'Ngoại ngữ', 'Khác'],
        },
        yaxis: {
            title: {
                text: 'Doanh thu (triệu VNĐ)'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " triệu VNĐ"
                }
            }
        }
    });
    barChart.render();
}); 