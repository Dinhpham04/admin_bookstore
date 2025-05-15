document.addEventListener('DOMContentLoaded', function () {
    // Handle profile image upload
    const uploadBtn = document.querySelector('.btn-upload');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function (e) {
                const file = e.target.files[0];
                if (file) {
                    // Here you would typically upload the file to server
                    // For now, we'll just show a preview
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        document.querySelector('.profile-card img').src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }

    // Handle form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            // Here you would typically send the form data to server
            // For now, we'll just show a success message
            alert('Changes saved successfully!');
        });
    });

    // Handle tab switching
    const tabLinks = document.querySelectorAll('.nav-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('data-bs-target');

            // Remove active class from all tabs
            tabLinks.forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('show', 'active'));

            // Add active class to current tab
            this.classList.add('active');
            document.querySelector(target).classList.add('show', 'active');
        });
    });

    // Handle activity timeline
    function updateActivityTimeline() {
        const timeline = document.querySelector('.activity-timeline');
        if (timeline) {
            // Here you would typically fetch activities from server
            // For now, we'll use sample data
            const activities = [
                {
                    date: 'Today, 2:30 PM',
                    title: 'Profile Updated',
                    description: 'Updated profile information'
                },
                {
                    date: 'Yesterday, 1:45 PM',
                    title: 'Password Changed',
                    description: 'Changed account password'
                }
            ];

            // Clear existing activities
            timeline.innerHTML = '';

            // Add activities to timeline
            activities.forEach(activity => {
                const item = document.createElement('div');
                item.className = 'activity-item';
                item.innerHTML = `
                    <div class="activity-date">${activity.date}</div>
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                `;
                timeline.appendChild(item);
            });
        }
    }

    // Initialize activity timeline
    updateActivityTimeline();
});
