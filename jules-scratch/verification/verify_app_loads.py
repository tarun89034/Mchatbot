from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to the auth page
            page.goto("http://localhost:5173/auth")

            # Wait for the login form to be visible by checking for the heading
            # This confirms that the components have rendered without crashing
            heading = page.get_by_role("heading", name="Welcome back")
            expect(heading).to_be_visible(timeout=10000)

            # Take a screenshot to visually confirm the page loads
            page.screenshot(path="jules-scratch/verification/verification.png")
            print("Screenshot taken successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="jules-scratch/verification/error.png")

        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()