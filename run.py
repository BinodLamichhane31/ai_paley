from app import create_app

app = create_app()
print(app.jinja_loader.list_templates())

if __name__ == '__main__':
    app.run(debug=False)