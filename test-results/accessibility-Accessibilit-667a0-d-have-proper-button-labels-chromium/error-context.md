# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - heading "Your place to work Plan. Create. Control." [level=3] [ref=e5]
    - img "Workspace illustration" [ref=e6]
  - generic [ref=e8]:
    - heading "Sign In to Woorkroom" [level=6] [ref=e9]
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic:
          - text: Email Address
          - generic: "*"
        - generic [ref=e13]:
          - textbox "Email Address" [ref=e14]:
            - /placeholder: youremail@gmail.com
          - group:
            - generic: Email Address *
      - generic [ref=e15]:
        - generic:
          - text: Password
          - generic: "*"
        - generic [ref=e16]:
          - textbox "Password" [ref=e17]:
            - /placeholder: ••••••••
          - button [ref=e19] [cursor=pointer]:
            - img [ref=e20]
          - group:
            - generic: Password *
      - button "Sign In" [ref=e22] [cursor=pointer]
```