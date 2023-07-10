from locust import HttpUser, task

class HelloWorldUser(HttpUser):
    @task
    def book_page(self):
        self.client.get("/")
        self.client.get("/book/649156988774518c9ee0e60d")